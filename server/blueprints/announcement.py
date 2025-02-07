from datetime import datetime
from flask import Blueprint, jsonify, request
from middlewares.memeber_required import member_required
from config.mongodb import anns
import json
from bson import json_util
from bson.objectid import ObjectId

ann_bp = Blueprint('ann',__name__)

@ann_bp.route("",methods=['POST'])
@member_required
def create_ann(userdata):
    try:
        data = request.get_json()
        data['class_id'] = ObjectId(data['class_id'])
        data['user_id'] = ObjectId(userdata['userid'])
        data['time'] = int(datetime.now().timestamp()*1000)
        data['username'] = userdata['username']
        current_anns = list(anns.find({"class_id":data['class_id']}).sort({"time":-1}).limit(10))
        anns.insert_one(data)
        current_anns.insert(0,data)
        print(current_anns)
        return jsonify({"success":True,"message":"announcement created","anns":json.loads(json_util.dumps(current_anns))})
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@ann_bp.route("/anns/<class_id>",methods=['GET'])
@member_required
def get_work(class_id,userdata):
    try:
        skip = request.args.get('skip',default=0,type=int)
        anns_data = anns.find({"class_id":ObjectId(class_id)}).sort({"time":-1}).limit(10).skip(skip)
        return jsonify({"success":True,"anns":json.loads(json_util.dumps(anns_data))})
    except:
        return jsonify({"success":False,"message":"something went wrong!"}) , 500

