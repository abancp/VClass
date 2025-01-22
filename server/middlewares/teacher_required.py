import jwt
from functools import wraps
from flask import request,jsonify,current_app
import os

def teacher_required(f):
    @wraps(f)
    def decorated_function(*args,**kwargs):
        try:
            class_id = request.view_args.get('class_id') if request.view_args else None
            if not class_id:
                data = request.get_json()
                if 'class_id' in data:
                    class_id = data['class_id']
            token = request.cookies.get("token")
            if not token or not class_id:
                return jsonify({"success":False,"message":"Auth failed"}) , 401
            data = jwt.decode(token,str(os.getenv("JWT_SECRET")),algorithms=['HS256'])
            print(data)
            if not data['roles'][class_id] == "teacher":
                return jsonify({"success":False,"message":"Auth failed"}) , 401

        except Exception as e:
            print(e)
            return jsonify({"success":False,"message":"Somthing went wrong while Authonticating"}) , 500 
        
        return f(*args,**kwargs,userdata=data)
    return decorated_function
