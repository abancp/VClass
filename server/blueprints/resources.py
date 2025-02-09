from flask import Blueprint, jsonify, request
from bson import ObjectId
from middlewares.teacher_required import teacher_required
from config.mongodb import srcs 

scr_bp = Blueprint('src',__name__)

@scr_bp.route('',methods=['GET'])
@teacher_required
def create_rscr(userdata):
    try:
        data = request.get_json()
        data['teacher'] = ObjectId(userdata['userid'])
        srcs.insert_one(data)
        return jsonify({"success":True,"message":"resource saved!"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

