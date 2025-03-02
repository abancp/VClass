from datetime import time
from typing import Required
from b2sdk._internal.encryption.setting import urllib
from flask import Blueprint, jsonify, request
from google.generativeai.types.content_types import to_part
from jwt import exceptions
from bson import ObjectId
from middlewares.memeber_required import member_required
from middlewares.teacher_required import teacher_required
from config.mongodb import srcs 
from bson import json_util
from utils import convert_objectid_to_string
from b2sdk.v2 import InMemoryAccountInfo, B2Api
import requests
import nanoid
import mimetypes
import time
import os
from dotenv import load_dotenv

load_dotenv()

src_bp = Blueprint('src',__name__)
try:
    info = InMemoryAccountInfo()
    b2_api = B2Api(info)
    auth_time = time.time()
    b2_api.authorize_account("production",os.getenv("B2_APP_KEY_ID"),os.getenv("B2_APP_KEY"))
    print(b2_api.account_info.get_allowed())
    bucket = b2_api.get_bucket_by_name(os.getenv("B2_BUCKET_NAME"))
except Exception as e:
    print("Error while auth b2",e)

def get_file_extension(content_type):
    extension = mimetypes.guess_extension(content_type)
    return extension if extension else ""


def ensure_authorized():
    global auth_time
    if time.time() - auth_time  > 36000:
        print("🔄 Reauthorizing B2...")
        b2_api.authorize_account("production",os.getenv("B2_APP_KEY_ID"),os.getenv("B2_APP_KEY"))
        auth_time = time.time()


@src_bp.route('/<class_id>',methods=['POST'])
@teacher_required
def create_src(class_id,userdata):
    try:
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({"success":False,"message":"file not found"}),400
            data = {}
            data['teacher'] = ObjectId(userdata['userid'])
            data['class_id'] = ObjectId(class_id)
            data['type'] = file.content_type
            file_data = file.read()
            ensure_authorized()
            bucket = b2_api.get_bucket_by_name("VClass")
            upload_url_info = b2_api.session.get_upload_url(bucket.id_)
            file_name = nanoid.generate(size=12)
            file_name = class_id+"<->"+file_name+get_file_extension(file.content_type)   
            print(upload_url_info)
            data['title'] = request.form.get("title")
            headers = {
                "Authorization": upload_url_info['authorizationToken'],
                "X-Bz-File-Name": urllib.parse.quote(file_name),
                "Content-Type": "b2/x-auto",
                "X-Bz-Content-Sha1": "do_not_verify",
            }
            response = requests.post(upload_url_info['uploadUrl'],headers=headers,data=file_data)
            print(response.json()['fileId'])
            data['url'] = file_name 
            srcs.insert_one(data)
            return jsonify({"success":True,"message":"resource saved!"})
        else:
            data = request.get_json()
            data['teacher'] = ObjectId(userdata['userid'])
            data['class_id'] = ObjectId(class_id)
            srcs.insert_one(data)
            return jsonify({"success":True,"message":"resource saved!"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@src_bp.route('/<class_id>/get-file-url/<file_name>',methods=['GET'])
@member_required
def get_file_url(class_id,file_name,userdata):
    try:
        ensure_authorized()
        if not file_name:
            return jsonify({"success":False,"message":"file name is required!"}),400
        bucket = b2_api.get_bucket_by_name("VClass")
        download_auth = bucket.get_download_authorization(file_name,3000)
        signed_url = f"https://f003.backblazeb2.com/file/VClass/{urllib.parse.quote(file_name)}?Authorization={download_auth}"

        return jsonify({"success":True,"download_url":signed_url})
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),400



@src_bp.route('/srcs/<class_id>',methods=['GET'])
@member_required
def get_src(class_id,userdata):
    try:
        limit = request.args.get('limit',default=0,type=int)
        skip = request.args.get('skip',default=0,type=int)
        find_srcs = list(srcs.find({"class_id":ObjectId(class_id)}).sort({"_id":-1}).limit(limit).skip(skip))
        if not find_srcs:
            return jsonify({"success":True,"srcs":[]})
        else:
            return jsonify({"success":True,"srcs":convert_objectid_to_string(find_srcs)})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500
            



    
    

