import jwt
import pandas as pd
import io
from jwt import algorithms
from pika.spec import methods
from bson.objectid import ObjectId
from flask import Blueprint, current_app, json, jsonify, make_response, request, send_file
from config.mongodb import classes,users,submits,works,anns,srcs,events,db
from middlewares.jwt_protect import jwt_required
from nanoid import generate
from bson import json_util
from middlewares.memeber_required import member_required
import os
import redis
from middlewares.teacher_required import teacher_required
from utils import convert_objectid_to_string



redis_client = redis.Redis(host=os.getenv('REDIS_HOST'), port=6379, db=0, decode_responses=True)


class_bp = Blueprint('class',__name__)


@class_bp.route("/",methods=['POST'])
@jwt_required
def create_class(userdata):
    try:
        unique_key = generate(size=6)
        data = request.get_json()
        data['students'] = []
        data['teachers'] = [ObjectId(userdata['userid'])]
        data['key'] = unique_key
        data['number_of_students'] = 0
        data['creater'] = ObjectId(userdata['userid'])

        data['settings'] = {
            "announcements":{
                "post_permission":{
                    "teacher":True,
                    "student":True
                },
            },
            "doubts":{
                "comment_permission":"everyone",
                "ai_comment":"all"
            }
        }

        inserted_class = classes.insert_one(data)
        users.update_one({"_id":ObjectId(userdata['userid'])},{"$push":{"teacher":inserted_class.inserted_id}})
        token = jwt.encode(userdata,os.getenv('JWT_SECRET'),algorithm='HS256')
        res =  make_response(jsonify({"success":True,"classid":str(inserted_class.inserted_id),"message":"created class : "+data['name']}))  
        res.set_cookie('token',token,max_age=360000)
        return res
    except Exception as e:
        print(e)
        return jsonify({"success":False, "message":"Something went wrong!"}) , 500


@class_bp.route("/<class_id>",methods=['GET'])
@member_required
def get_class(class_id,userdata):
    try:
        class_ = classes.find_one({"_id":ObjectId(class_id)})
        if not class_:
            return jsonify({"succes":False,"message":"class not found!"}),404

        class_['_id'] = str(class_['_id'])
        del class_['students']
        class_ = convert_objectid_to_string(class_)
        if userdata['userid'] not in class_['teachers']:
            del class_['teachers']
            del class_['key']
            return jsonify({"success":True,"role":"student","class":json_util.loads(json_util.dumps(class_))}) 
        return jsonify({"succes":True,"role":"teacher","class":json_util.loads(json_util.dumps(class_))})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"Something went wrong!"}) , 500

@class_bp.route("/peoples/<class_id>",methods=['GET'])
@member_required
def get_peoples(class_id,userdata):

    pipeline = [
    {
        "$match": {
            "_id": ObjectId(class_id)
        }
    },
    {
        "$lookup": {
            "from": "users",
            "localField": "students",
            "foreignField": "_id",
            "as": "studentDetails"
        }
    },
    {
        "$lookup": {
            "from": "users",
            "localField": "teachers",
            "foreignField": "_id",
            "as": "teacherDetails"
        }
    },
    {
        "$project": {
            "_id": 0,
            "students": {
                "$map": {
                    "input": "$studentDetails",
                    "as": "student",
                    "in": {
                        "username": "$$student.username",
                        "_id": { "$toString": "$$student._id" }  # Convert ObjectId to string
                    }
                }
            },
            "teachers": {
                "$map": {
                    "input": "$teacherDetails",
                    "as": "teacher",
                    "in": {
                        "username": "$$teacher.username",
                        "_id": { "$toString": "$$teacher._id" }  # Convert ObjectId to string
                    }
                }
            }
        }
    }
]
   
    peoples = classes.aggregate(pipeline)
    return jsonify({"peoples":json_util.loads(json_util.dumps(peoples))[0],"success":True})


@class_bp.route("/join",methods=['POST'])
@jwt_required
def join_class(userdata):
    try:
        data = request.get_json()
        userObjectId = ObjectId(userdata['userid'])
        found_class = classes.find_one(data)
        if not found_class:
            return jsonify({"success":False,"message":"class not found"}),404
        user = users.find_one({"_id":userObjectId},{"student":1,"teacher":1})
        print(user,found_class['_id'])
        if found_class['_id'] in user['teacher'] or found_class['_id'] in user['student']:
            return jsonify({"success":False,"message":"users already joined","classid":str(found_class['_id'])}),409
        users.update_one({"_id":userObjectId},{"$push":{"student":found_class['_id']}})
        classes.update_one({"_id":found_class['_id']},{"$push":{"students":ObjectId(userdata['userid'])},"$inc":{"number_of_students":1}})
        print(userdata)
        token = jwt.encode(userdata,os.getenv('JWT_SECRET'),algorithm='HS256')
        res =  make_response(jsonify({"success":True,"classid":str(found_class['_id']),"message":"Joined to class"}))  
        res.set_cookie('token',token,max_age=360000)
        redis_client.delete(f"user_roles:{data['user_id']}_{data['class_id']}")
        return res,200
    except Exception as e :
        print(e)
        return jsonify({"success":False,"message":"Something went wrong!"}),500

@class_bp.route("/public/join",methods=['POST'])
@jwt_required
def join_public_class(userdata):
    try:
        data = request.get_json()
        data['_id'] = ObjectId(data['_id'])
        print(data)
        userObjectId = ObjectId(userdata['userid'])
        found_class = classes.find_one(data)
        if not found_class:
            return jsonify({"success":False,"message":"class not found"}),404
        user = users.find_one({"_id":userObjectId},{"student":1,"teacher":1})
        print(user,found_class['_id'])
        if found_class['_id'] in user['teacher'] or found_class['_id'] in user['student']:
            return jsonify({"success":False,"message":"users already joined","classid":str(found_class['_id'])}),409
        users.update_one({"_id":userObjectId},{"$push":{"student":found_class['_id']}})
        classes.update_one({"_id":found_class['_id']},{"$push":{"students":ObjectId(userdata['userid'])},"$inc":{"number_of_students":1}})
        redis_client.delete(f"user_roles:{userdata['userid']}_{str(data['_id'])}")
        res =  make_response(jsonify({"success":True,"classid":str(found_class['_id']),"message":"Joined to class"}))  
        return res,200
    except Exception as e :
        print(e)
        return jsonify({"success":False,"message":"Something went wrong!"}),500

@class_bp.route("/classes",methods=['GET'])
@jwt_required
def get_classes(userdata):
    pipeline = [
    {
        "$match": {"_id": ObjectId(userdata['userid'])}  # Match the specific user
    },
    {
        "$set": {
            "combined_roles": {
                "$concatArrays": ["$student", "$teacher"]
            }
        }
    },
    {
        "$lookup": {
            "from": "classes",
            "localField": "combined_roles",
            "foreignField": "_id",
            "as": "class_details"
        }
    },
    {
        "$unwind": "$class_details"  # Unwind class_details array
    },
    {
        "$project": {
            "_id":0,
            "id":{"$toString":"$class_details._id"},
            "name": "$class_details.name", 
            "subject": "$class_details.subject",  
            "public":"$class_details.public",
            "description":"$class_details.description",
            "number_of_students":"$class_details.number_of_students",
            "bg_url":"$class_details.bg_url",
        }
    }
]

    try:
        class_details = users.aggregate(pipeline)
        print(class_details)
        return jsonify({"success":True,"classes":json_util.loads(json_util.dumps(list(class_details)))})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"Something went wrong"}),500


@class_bp.route("/public/classes",methods=['GET'])
@jwt_required
def get_public_classes(userdata):
    try:

        pipeline_public = [
    {
        "$match": {"public": True}  # Match only public classes
    },
    {
        "$lookup": {
            "from": "users",
            "localField": "creater",
            "foreignField": "_id",
            "as": "creater_details"
        }
    },
    {
        "$unwind": "$creater_details"  # Unwind class_details array
    },
    {
        "$project": {
            "_id": 0,
            "id": {"$toString": "$_id"},
            "name": "$name",
            "subject": "$subject",
            "description": "$description",
            "number_of_students": "$number_of_students",
            "bg_url": "$bg_url",
            "creater":"$creater_details.username",
            "creater_profile_url":"$creater_details.profile_url"
        }
    }
]
        class_details = classes.aggregate(pipeline_public)
        return jsonify({"a":1,"success":True,"classes":json_util.loads(json_util.dumps(list(class_details)))})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"Something went wrong"}),500



@class_bp.route('/remove-student',methods=['post'])
@teacher_required
def remove_student(userdata):
    data = request.get_json()
    classes.update_one({"_id":ObjectId(data['class_id'])},{"$pull":{"students":ObjectId(data['user_id'])},"$inc":{"number_of_students":-1}})
    users.update_one({"_id":ObjectId(data['user_id'])},{"$pull":{"student":ObjectId(data['class_id'])}})
    redis_client.delete(f"user_roles:{data['user_id']}_{data['class_id']}")
    return jsonify({"success":True,"message":"student removed"})


@class_bp.route("/student/<class_id>/<user_id>",methods=['GET'])
@teacher_required
def get_student_data(class_id,user_id,userdata):
    try:
        pipeline = [
    {
    "$match": {
      "class_id": { "$eq": ObjectId(class_id) },
      "user_id": { "$eq": ObjectId(user_id) }
    }
     },
    {
    "$lookup": {
      "from": "works",
      "localField": "work_id",
    "foreignField": "_id",
      "as": "workDetails"
    }
  },
  {
    "$unwind": "$workDetails"
  },
  {
    "$project": {
      "_id": 0,
      "work_title": "$workDetails.title",
      "mark": "$mark"
    }
  }
]
        data = submits.aggregate(pipeline)
        return jsonify({"success":True,"user":json.loads(json_util.dumps(data))})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@class_bp.route("/delete/<class_id>",methods=['DELETE'])
@teacher_required
def delete_class(class_id,userdata):
    try:
        classes.delete_many({"_id":ObjectId(class_id)})
        submits.delete_many({"class_id":ObjectId(class_id)})
        works.delete_many({"class_id":ObjectId(class_id)})
        anns.delete_many({"class_id":ObjectId(class_id)})
        srcs.delete_many({"class_id":ObjectId(class_id)})
        events.delete_many({"class_id":ObjectId(class_id)})
        return jsonify({"success":True,"message":"Class delted!"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500


@class_bp.route("/make/teacher",methods=['POST'])
@teacher_required
def make_teacher(userdata):
    try:
        data = request.get_json()
        classes.update_one({"_id":ObjectId(data['class_id'])},{"$pull":{"students":ObjectId(data['user_id'])},"$push":{"teachers":ObjectId(data['user_id'])}})
        users.update_one({"_id":ObjectId(data['user_id'])},{"$pull":{"student":ObjectId(data['class_id'])},"$push":{"teacher":ObjectId(data['class_id'])}})
        redis_client.delete(f"user_roles:{data['user_id']}_{data['class_id']}")
        return jsonify({"success":True,"message":"Teacher added"})
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500
        
@class_bp.route("/remove/teacher",methods=['POST'])
@teacher_required
def remove_teacher(userdata):
    try:
        data = request.get_json()
        if userdata['userid'] == data['user_id']:
            return jsonify({"success":False,"message":"Yourself can't remove from teacher"})
        classes.update_one({"_id":ObjectId(data['class_id'])},{"$push":{"students":ObjectId(data['user_id'])},"$pull":{"teachers":ObjectId(data['user_id'])}})
        users.update_one({"_id":ObjectId(data['user_id'])},{"$push":{"student":ObjectId(data['class_id'])},"$pull":{"teacher":ObjectId(data['class_id'])}})
        redis_client.delete(f"user_roles:{data['user_id']}_{data['class_id']}")
        return jsonify({"success":True,"message":"Teacher added"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@class_bp.route("/info/<class_id>",methods=['POST','GET'])
def create_or_get_info(class_id):
    if request.method == "POST":
        return create_info(class_id)
    elif request.method == "GET":
        return get_info(class_id)
    else:       
        return jsonify({"success":False,"error":"Method not Allowed!"}),405

@teacher_required
def create_info(class_id,userdata):
    try:
        data = request.get_json()
        db['infos'].replace_one({"class_id":ObjectId(class_id)},{"class_id":ObjectId(class_id),"info":data['info']},upsert=True)
        return jsonify({"success":True,"message":"Created Info"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@jwt_required
def get_info(class_id,userdata):
    try:
        info_doc = db['infos'].find_one({"class_id":ObjectId(class_id)},{"info":1})
        if not info_doc:
            return jsonify({"success":True,"message":"No info found","info":""})
        return jsonify({"success":True,"info":info_doc['info']}) 
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@class_bp.route("/att/<class_id>",methods=['POST'])
@teacher_required
def update_att(class_id,userdata):
    try:
        data = request.get_json()
        db['atts'].insert_one({"class_id":ObjectId(class_id),"att":data['att']})
        return jsonify({"success":True,"message":"updated"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@class_bp.route('/<class_id>/att/export-excel',methods=['GET'])
@teacher_required
def export_submits(class_id,userdata):

    data = list(db['atts'].find({"class_id":ObjectId(class_id)}))# Exclude MongoDB "_id" field
    print(data)
    #data = list(submits.find({"class_id":ObjectId(class_id)}, {"_id": 0})) 
    df = pd.DataFrame(data)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Data')
    
    output.seek(0)
    return send_file(output, download_name="data.xlsx", as_attachment=True, mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

