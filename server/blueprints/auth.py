import bcrypt
from bson.objectid import ObjectId
from flask import Blueprint,request,jsonify,make_response,current_app
import jwt
from config.mongodb import users
import os

auth_bp = Blueprint('auth',__name__)

@auth_bp.route('/register',methods=["POST"])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    profile_url = data.get('profile_url',None)
    sign_with_google = data.get('google',False)

    exist_user = users.find_one({"email":email})
    if exist_user:
        userid = str(exist_user['_id'])
        if not sign_with_google:
            return jsonify({"message":"email already taken","success":False}) , 400
    else:
        if sign_with_google:
            registerd_res = users.insert_one({"username": username, "email": email, "student":[],"teacher":[],"profile_url":profile_url})
        else:
            password = data.get('password')
            hashed_password = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
            registerd_res = users.insert_one({"username": username, "email": email, "password": hashed_password,"student":[],"teacher":[],"profile_url":profile_url})
        userid = str(registerd_res.inserted_id)
    print(userid)
    token = jwt.encode({
        "userid":userid,
        "username":username,
        "email":email,
    },str(os.getenv('JWT_SECRET')),algorithm='HS256')

    res = make_response(jsonify({"success":True,"message":"user registered successfully : "+username}))
    print(token)
    res.set_cookie('token',token,max_age=360000,secure=True,samesite="None")
    return res

@auth_bp.route("/login",methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    sign_with_google = data.get('google',False)
    password = data.get('password','')
    user = users.find_one({"email":email})
    print(user)
    if not user:
        return jsonify({"message":"user not found or password not matching"}) , 401
    if not sign_with_google: 
        if not bcrypt.checkpw(password.encode('utf-8'),user['password']):
            return jsonify({"message":"user not found or password not matching"}) , 401

    print(user) 
    token = jwt.encode({
        "userid":str(user['_id']),
        "username":user['username'],
        "email":user['email'],
    },str(os.getenv("JWT_SECRET")),algorithm='HS256')

    res = make_response(jsonify({"message":"user login successfully : "+user['username'],"username":user['username'],"profile_url":user['profile_url']}))
    res.set_cookie('token',token,max_age=360000,secure=True,samesite="None")
    return res

@auth_bp.get("/get-userdata")
def get_userdata():
    token = request.cookies.get('token')
    if not token:
        return jsonify({"success":False}) , 401
    try:
        data = jwt.decode(str(token),str(os.getenv("JWT_SECRET")),algorithms=['HS256'])
        user = users.find_one({"_id":ObjectId(data['userid'])})
        if not user:
            return jsonify({"success":False,"message":"user not found"})
        return jsonify({"success":True,"username":data['username'],"profile_url":user['profile_url']})
    except Exception as e:
        print(e)
        return jsonify({"success":False}) , 500 

