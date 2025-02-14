import jwt
from functools import wraps
from flask import request,jsonify,current_app
import os

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
            data['role'] = data['roles'][class_id] 
            if data['role'] not in ["student","teacher"]:
                return jsonify({"success":False,"message":"Auth failed","error":"role not matching"}) , 401

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
