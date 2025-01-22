import datetime
from bson import json_util
from flask import Blueprint, jsonify,request
from config.mongodb import classes,users,works
from middlewares.memeber_required import member_required
from middlewares.teacher_required import teacher_required
import json

work_bp = Blueprint('work',__name__)

@work_bp.route("/add/<work_type>",methods=['POST'])
@teacher_required
def create_work(work_type,userdata):
    try:
        data = request.get_json()
        data['teacher'] = userdata['userid']
        data['teacher_name'] = userdata['username']
        data['type'] = work_type
        data['time'] = int(datetime.datetime.now().timestamp()*1000)
        print(data)
        works.insert_one(data)
        return jsonify({"success":True,"message":"Task assigned!"})
    except:
        return jsonify({"success":False,"message":"Something went wrong!"}),500


@work_bp.route("/works/<class_id>",methods=['GET'])
@member_required
def get_work(class_id,userdata):
    skip = request.args.get('skip',default=0,type=int)
    works_data = works.find({"class_id":class_id}).sort({"time":-1}).limit(10).skip(skip)
    return jsonify({"success":True,"works":json.loads(json_util.dumps(works_data))})

