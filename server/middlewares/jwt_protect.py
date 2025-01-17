from re import L
import jwt
from functools import wraps
from flask import request,jsonify,current_app

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args,**kwargs):
        token = request.cookies.get("token")
        if not token:
            return jsonify({"success":False,"message":"Auth failed"}) , 403
        try:
            data = jwt.decode(token,current_app.config['JWT_SECRET'],algorithms=['HS256'])
            print("Extracted data",data)
        except :
            return jsonify({"success":False,"message":"Auth failed"}) , 403
        
        return f(*args,**kwargs,userdata=data)
    return decorated_function
