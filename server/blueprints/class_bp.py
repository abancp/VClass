import jwt
from jwt import algorithms
from bson.objectid import ObjectId
from flask import Blueprint, current_app, json, jsonify, make_response, request
from config.mongodb import classes,users
from middlewares.jwt_protect import jwt_required
from nanoid import generate
from bson import json_util
from middlewares.memeber_required import member_required
import os

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
        users.update_one({"_id":ObjectId(userdata['userid'])},{"$push":{"teacher":str(inserted_class.inserted_id)}})
        userdata['roles'][str(inserted_class.inserted_id)] = "teacher"
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
        class_ = classes.find_one({"_id":ObjectId(class_id)},{'_id':1,'name':1,'subject':1,'description':1,'key':1,'number_of_students':1,'creater':1})
        class_['_id'] = str(class_['_id'])
        return jsonify({"succes":True,"class":class_})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"Something went wrong!"}) , 500

@class_bp.route("/peoples/<class_id>",methods=['GET'])
@member_required
def get_peoples(class_id,userdata):
    pipeline = [
  {
    "$match": {
      "_id": ObjectId(class_id)    }
  },
  {
    "$addFields": {
      "students": {
        "$map": {
          "input": "$students",
          "as": "studentId",
          "in": { "$toObjectId": "$$studentId" }
        }
      },
      "teachers": {
        "$map": {
          "input": "$teachers",
          "as": "teacherId",
          "in": { "$toObjectId": "$$teacherId" }
        }
      }
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
          "in": "$$student.username"
        }
      },
      "teachers": {
        "$map": {
          "input": "$teacherDetails",
          "as": "teacher",
          "in": "$$teacher.username"
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
            return jsonify({"success":False,"message":"class not found"})
        users.update_one({"_id":userObjectId},{"$push":{"student":str(found_class['_id'])}})
        classes.update_one({"_id":found_class['_id']},{"$push":{"students":str(userdata['userid'])},"$inc":{"number_of_students":1}})
        userdata['roles'][str(found_class['_id'])] = "student"
        token = jwt.encode(userdata,os.getenv('JWT_SECRET'),algorithm='HS256')
        res =  make_response(jsonify({"success":True,"classid":str(found_class['_id']),"message":"Joined to class"}))  
        res.set_cookie('token',token,max_age=360000)
        return res
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
        "$addFields": {
            "combined_roles": {
                "$map": {
                    "input": "$combined_roles",
                    "as": "class_id",
                    "in": {"$toObjectId": "$$class_id"}  # Convert class IDs to ObjectId
                }
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
            "name": "$class_details.name",  # Include class name
            "subject": "$class_details.subject",  # Include subject
            "description":"$class_details.description",
            "number_of_students":"$class_details.number_of_students",
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

   


