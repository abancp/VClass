from flask import Blueprint, jsonify, request
import google.generativeai as genai
from middlewares.jwt_protect import jwt_required
from middlewares.memeber_required import member_required
from config.genai import model
import re
import json
from bson import ObjectId 
from config.mongodb import db
from utils import is_valid_ObjectId 

ai_bp = Blueprint('ai',__name__)

@ai_bp.route('/<class_id>/gen',methods=['POST'])
@member_required
def gen(class_id,userdata):
    try:
        data = request.get_json()
        system_prompt = "you are a ai assinstand for a virtual class named VClass . users asking questions by prompt. generate positive response depends on users role,name,and prompt : "
        general_prompt = system_prompt+ f"[ role :{userdata['role']} ,username:{userdata['username']}, prompt:{data['prompt']} ]"
        mongo_system_prompt = """you are a query generator for a virtual class named VClass Application . schema of mongodb { "classes": { "_id": "ObjectId", "name": "String", "subject": "String", "description": "String", "students": ["ObjectId"], "teachers": ["ObjectId"], "key": "String", "number_of_students": "Number", "creater": "ObjectId" }, "works": { "_id": "ObjectId", "class_id": "ObjectId", "title": "String", "instruction": "String", "students": ["String"], "due_date": "Long", "can_edit": "Boolean", "teacher": "ObjectId", "teacher_name": "String", "type": "String", "accept_submits": "Boolean", "time": "Long" }, "submits": { "_id": "ObjectId", "work_id": "ObjectId", "class_id": "ObjectId", "user_id": "ObjectId", "data": "Object", "time": "Long" }, "users": { "_id": "ObjectId", "username": "String", "email": "String", "password": "Binary", "student": ["ObjectId"], "teacher": ["ObjectId"] } } . the collections are classes,users,works,submits . you need convert user promt to mongodb query consider above schema.you need generate only mongodb query based on user prompt .

if prompt is need access other than this class's scope . generate <no_permission>

generate query like db.collection.aggregate(...).


consider 1:  the class id will be given in the time execution of this query . you are in a class room . a classroom have a mongodb _id . use <class_id> when generating query we will replace that with actual class_id
imoprtant : all json object keys mut be enclosed in double quates
the user only have permission to perform any operation in out of the class . if anything smells wrong . generate <no_permission>
"""+f"""
if user is not teacher of the class and user asking sensitive data like key or submits

dont generate query in this format : db.collection("collection_name").....
the format of query is :db.collection_name.aggregate()

this query is executing in python . so make it python friendly

use only aggregation 

remember to convert class_id to ObjectId()

consider 2: a work is consider as submied if a user_id and work_id in a document in works collection 

consider 3 : all times are stored in unix milliseconds

consider 4 : a work's due_date is the last date of accepting submits

user role in this class is {userdata['role']} 

if user prompt is not about data from database just response <general>

user prompt : 
"""

        response = model.generate_content(mongo_system_prompt+data['prompt'])
        print(response.text)
        if "<no_permission>" in response.text:
            return jsonify({"success":True,"response":"for security . we can 't proceed with your question"})
        elif "<general>" in response.text:
            response = model.generate_content(general_prompt)
            return jsonify({"success":True,"response":response.text})
        else:
            query = response.text
            collection_match = re.search(r'db\.(\w+)\.\w+', query)
            collection_name = collection_match.group(1) if collection_match else None
            if not collection_name:
                return jsonify({"success":False,"message":"invalid query"}) , 500
            print(query)
            if query.startswith('```'):
                query.removeprefix('```').removesuffix('```')
                if '[' in query and ']' in query:
                    query = re.search(r'\[([\s\S]+)\]', query).group(0)
                pipeline_str = re.sub(r"<class_id>",class_id,query)
                pipeline_str = pipeline_str.replace("ObjectId(","").replace('")','"')
                print(pipeline_str)
                pipeline = json.loads(pipeline_str)
                for stage in pipeline:
                    if "$match" in stage:
                        if "_id" in stage["$match"]:
                            if is_valid_ObjectId(stage["$match"]["_id"]):
                                stage["$match"]["_id"] = ObjectId(stage["$match"]["_id"])

                        if "class_id" in stage["$match"]:
                            if is_valid_ObjectId(stage["$match"]["class_id"]):
                                stage["$match"]["class_id"] = ObjectId(stage["$match"]["class_id"])

                        if "work_id" in stage["$match"]:
                            if is_valid_ObjectId(stage["$match"]["work_id"]):
                                stage["$match"]["work_id"] = ObjectId(stage["$match"]["work_id"])

                        if "user_id" in stage["$match"]:
                            if is_valid_ObjectId(stage["$match"]["user_id"]):
                                stage["$match"]["user_id"] = ObjectId(stage["$match"]["user_id"])

                result = list(db[collection_name].aggregate(pipeline)) 
            else:
                result = "something went wrong with database operation"
            response = model.generate_content(f"""you are a ai assinstand in virtual class named VClass user askeda question and answer given here generate a response for the prompt from user with reuslt from database .nombers are express in numeric way not in english . if user ask for a date or time the database will return date or time as unixbased milliseconds you need convert it . make response with natural language . userdata :  [username {userdata['username']} is a {userdata['role']} ] , prompt : {data['prompt']} , result : {str(result)} """)

            print(result)
            return jsonify({"success":True,"response":response.text})  
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500
