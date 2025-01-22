from datetime import datetime
from flask import Blueprint, jsonify, request
from middlewares.memeber_required import member_required
from config.mongodb import anns
import json
from bson import json_util

ann_bp = Blueprint('ann',__name__)

@ann_bp.route("",methods=['POST'])
@member_required
def create_ann(userdata):
    try:
        data = request.get_json()
        data['time'] = int(datetime.now().timestamp()*1000)
        data['user_id'] = userdata['userid']
        anns.insert_one(data)
        return jsonify({"success":True,"message":"announcement created"})
    except:
        return jsonify({"success":False,"message":"something went wrong!"}),500

@ann_bp.route("/anns/<class_id>",methods=['GET'])
@member_required
def get_work(class_id,userdata):
    try:
        skip = request.args.get('skip',default=0,type=int)
        works_data = anns.find({"class_id":class_id}).sort({"time":-1}).limit(10).skip(skip)
        return jsonify({"success":True,"anns":json.loads(json_util.dumps(works_data))})
    except:
        return jsonify({"success":False,"message":"something went wrong!"}) , 500

