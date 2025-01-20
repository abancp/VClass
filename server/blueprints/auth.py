import bcrypt
from bson.objectid import ObjectId
from flask import Blueprint,request,jsonify,make_response,current_app
import jwt
from config.mongodb import users
import os

auth_bp = Blueprint('auth',__name__)

@auth_bp.route('/register',methods=["POST"])
def register():
    
    #get data from req
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    hashed_password = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())

    #check email already exist
    exist_user = users.find_one({"email":email})
    if exist_user:
        return jsonify({"message":"email already taken","success":False}) , 400
    
    #inserting to db
    registerd_res = users.insert_one({"username": username, "email": email, "password": hashed_password,"student":[],"teacher":[]})
    userid = str(registerd_res.inserted_id)
    print(userid)
    print(registerd_res)
    #create jwt token
    token = jwt.encode({
        "userid":userid,
        "username":username,
        "email":email,
        "roles":{},
    },current_app.config['JWT_SECRET'],algorithm='HS256')

    #set cookie and response
    res = make_response(jsonify({"message":"user registered successfully : "+username}))
    print(token)
    res.set_cookie('token',token,max_age=360000)
    return res

@auth_bp.route("/login",methods=['POST'])
def login():
    #get data from req
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users.find_one({"email":email})
    print(user)
    if not user:
        return jsonify({"message":"user not found or password not matching"}) , 401
    if not bcrypt.checkpw(password.encode('utf-8'),user['password']):
        return jsonify({"message":"user not found or password not matching"}) , 401

    print(user) 
    roles = {}
    for class_id in user['teacher']:
        roles[class_id] = 'teacher'
    for class_id in user['student']:
        roles[class_id] = 'student'
    #create jwt token
    token = jwt.encode({
        "userid":str(user['_id']),
        "username":user['username'],
        "email":user['email'],
        "roles":roles
    },str(os.getenv("JWT_SECRET")),algorithm='HS256')

    #set cookie and response
    res = make_response(jsonify({"message":"user registered successfully : "+user['username'],"username":user['username']}))
    res.set_cookie('token',token,max_age=360000)
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
        return jsonify({"success":True,"username":data['username']})
    except:
        return jsonify({"success":False}) , 401




