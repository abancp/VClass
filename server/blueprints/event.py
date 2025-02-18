import re
from flask import Blueprint, json, jsonify, request
from config.mongodb import events
from middlewares.memeber_required import member_required
from middlewares.teacher_required import teacher_required
from bson import json_util
from bson import ObjectId

event_bp = Blueprint('event',__name__)

@event_bp.route("/",methods=['POST'])
@teacher_required
def create_event(userdata):
    try:
        data = request.get_json()
        data['class_id'] = ObjectId(data['class_id'])
        events.insert_one(data)
        return jsonify({"success":True,"message":"event created!"})
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@event_bp.route("/<class_id>/between/<start>/<end>",methods=['GET'])
@member_required
def get_events(class_id,start,end,userdata):
    try:
        found_events = events.find({"$or":[{"end":{"$gt":int(start)}},{"start":{"$lt":int(end)}}],"class_id":ObjectId(class_id)})
        if not found_events :
            return jsonify({"success":True,"events":[]})
        return jsonify({"success":True,"events":json.loads(json_util.dumps(found_events))})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500
