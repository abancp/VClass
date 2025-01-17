from bson.objectid import ObjectId
from flask import Blueprint, json, jsonify, request
from config.mongodb import classes,users
from middlewares.jwt_protect import jwt_required
from nanoid import generate
from bson import json_util

class_bp = Blueprint('class',__name__)

@class_bp.route("/",methods=['POST'])
@jwt_required
def create_class(userdata):
    try:
        unique_key = generate(size=6)
        data = request.get_json()
        data['students'] = []
        data['teachers'] = [userdata['userid']]
        data['key'] = unique_key
        data['number_of_students'] = 0
        data['creater'] = userdata['userid']
        inserted_class = classes.insert_one(data)
        users.update_one({"_id":ObjectId(userdata['userid'])},{"$push":{"classes":str(inserted_class.inserted_id)}})
        return jsonify({"success":True,"classid":str(inserted_class.inserted_id),"message":"created class : "+data['name']})  
    except Exception as e:
        print(e)
        return jsonify({"success":False, "message":"Something went wrong!"}) , 500


@class_bp.route("/<id>",methods=['GET'])
@jwt_required
def get_class(id,userdata):
    object_id = ObjectId(id)
    user_ObjectId = ObjectId(userdata['userid'])
    try:
        class_ = classes.find_one(object_id)
        class_['_id'] = str(class_['_id'])
        if userdata['userid'] in class_['students']:
            return jsonify({"succes":True,"class":class_,"role":"student"})
        elif userdata['userid'] in class_['teachers']:
            return jsonify({"succes":True,"class":class_,"role":"teacher"})
        else:
            return jsonify({"succes":False,"message":"access denied"}) , 400
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"Something went wrong!"}) , 500

@class_bp.route("/join",methods=['POST'])
@jwt_required
def join_class(userdata):
    try:
        data = request.get_json()
        userObjectId = ObjectId(userdata['userid'])
        found_class = classes.find_one(data)
        if not found_class:
            return jsonify({"success":False,"message":"class not found"})
        users.update_one({"_id":userObjectId},{"$push":{"classes":found_class['_id']}})
        classes.update_one({"_id":found_class['_id']},{"$push":{"students":userdata['userid']},"$inc":{"number_of_students":1}})
    except Exception as e :
        print(e)
        return jsonify({"success":False,"message":"Something went wrong!"}),500
    return jsonify({"success":True,"classid":str(found_class['_id']),"message":"Joined to class"})
   

@class_bp.route("/classes",methods=['GET'])
@jwt_required
def get_classes(userdata):
    pipeline = [
    {
        "$match": {"_id": ObjectId(userdata['userid'])}  # Match the specific user
    },
    {
        "$addFields": {
            "classes": {
                "$map": {
                    "input": "$classes",
                    "as": "class_id",
                    "in": {"$toObjectId": "$$class_id"}  # Convert class IDs to ObjectId
                }
            }
        }
    },
    {
        "$lookup": {
            "from": "classes",
            "localField": "classes",
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
            "name": "$class_details.name",  # Include class name
            "subject": "$class_details.subject",  # Include subject
            "description":"$class_details.description",
            "number_of_students":"$class_details.number_of_students",
        }
    }
]

    try:
        class_details = users.aggregate(pipeline)
    except:
        return jsonify({"success":False,"message":"Something went wrong"}),500
    return jsonify({"success":True,"classes":json_util.loads(json_util.dumps(list(class_details)))})

    
