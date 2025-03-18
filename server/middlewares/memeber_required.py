import jwt
from functools import cache, wraps
from flask import request,jsonify,current_app
import os
import redis
from bson import ObjectId
from config.mongodb import users

def member_required(f):
    @wraps(f)
    def decorated_function(*args,**kwargs):
        try:
            class_id = request.view_args.get('class_id') if request.view_args else None
            if not class_id:
                data = request.get_json()
                if 'class_id' in data:
                    class_id = data['class_id']
            token = request.cookies.get("token")
            print("class_id",class_id,"token",token)
            if not token or not class_id:
                return jsonify({"success":False,"message":"Auth failed"}) , 401
            data = jwt.decode(token,str(os.getenv("JWT_SECRET")),algorithms=['HS256'])
            redis_client = redis.Redis(host=os.getenv('REDIS_HOST'), port=6379, db=0, decode_responses=True)
            cached_role = redis_client.get(f"user_roles:{data['userid']}_{class_id}")
            if cached_role:
                if cached_role not in ["t","s"]:
                    return jsonify({"success":False,"message":"Auth failed"}) , 401
                else:
                    data['role'] = "teacher" if cached_role == "t" else "student"
            else:
                user = users.find_one({"_id":ObjectId(data['userid'])})
                if user:
                    if ObjectId(class_id) in user.get('student',[]):
                        redis_client.setex(f"user_roles:{data['userid']}_{class_id}", 600,"s")
                        data['role'] = "student"
                    elif ObjectId(class_id) in user.get('teacher',[]):
                        redis_client.setex(f"user_roles:{data['userid']}_{class_id}",600,"t")
                        data['role'] = "teacher"
                    else:
                        redis_client.setex(f"user_roles:{data['userid']}_{class_id}",600,"n")
                        return jsonify({"success":False,"message":"Auth failed"}) , 401
                    

        except Exception as e:
            print("Exception in muddleware")
            print(e)
            response = jsonify({"success": False, "message": "Something went wrong while Authenticating", "error": str(e)})
            response.headers.add('Access-Control-Allow-Origin', 'https://vclass-xi.vercel.app,http://localhost:3000')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
            response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response , 500 
        
        return f(*args,**kwargs,userdata=data)
    return decorated_function
