import jwt
from functools import wraps
from flask import request,jsonify,current_app

def student_require(f):
    @wraps(f)
    def decorated_function(*args,**kwargs):
        class_id = request.view_args.get('class_id') if request.view_args else None
        token = request.cookies.get("token")
        if not token or not class_id:
            return jsonify({"success":False,"message":"Auth failed"}) , 401
        try:
            data = jwt.decode(token,current_app.config['JWT_SECRET'],algorithms=['HS256'])
            print(data)
            if not data['roles'][class_id] == "student":
                return jsonify({"success":False,"message":"Auth failed"}) , 401

        except :
            return jsonify({"success":False,"message":"Somthing went wrong while Authonticating"}) , 500 
        
        return f(*args,**kwargs,userdata=data)
    return decorated_function
