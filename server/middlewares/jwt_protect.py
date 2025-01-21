import jwt
from functools import wraps
from flask import request,jsonify,current_app
import os

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args,**kwargs):
        token = request.cookies.get("token")
        if not token:
            return jsonify({"success":False,"message":"Auth failed"}) , 401
        try:
            data = jwt.decode(token,str(os.getenv("JWT_SECRET")),algorithms=['HS256'])

            print(data)
            print("Extracted data",data)
        except :
            return jsonify({"success":False,"message":"Auth failed"}) , 401
        
        return f(*args,**kwargs,userdata=data)
    return decorated_function
