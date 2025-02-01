import datetime
from bson import json_util
from flask import Blueprint, jsonify,request
from config.mongodb import classes,users,works
from middlewares.memeber_required import member_required
from middlewares.teacher_required import teacher_required
import json
from bson.objectid import ObjectId

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
def get_works(class_id,userdata):
    try:
        skip = request.args.get('skip',default=0,type=int)
        works_data = works.find({"class_id":class_id}).sort({"time":-1}).limit(10).skip(skip)
        return jsonify({"success":True,"works":json.loads(json_util.dumps(works_data))})
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)})


@work_bp.route("/<class_id>/<work_type>/<work_id>",methods=['POST','GET'])
@member_required
def get_or_submit_work(class_id,work_type,work_id,userdata):
    if request.method == "GET":
        try:
            work = works.find_one({"_id":ObjectId(work_id)})
            class_ = classes.find_one({"_id":ObjectId(class_id)},{"name":1})
            if userdata['role'] == "teacher":
                return jsonify({"success":True,"work":json.loads(json_util.dumps(work))})
            else:
                if work['analysis']:
                    del work['analysis']
                return jsonify({"success":True,"class":json.loads(json_util.dumps(class_)),"work":json.loads(json_util.dumps(work))})
        except Exception as e:
            return jsonify({"Success":False,"message":"something went wrong!","error":str(e)}),500


