import datetime
import json
from flask import Blueprint, jsonify, request,current_app
from config.mongodb import COMMENT_LIKES_COLLECTION, DOUBT_COMMENTS_COLLECTION, DOUBTS_COLLECTION, USERS_COLLECTION, db,DOUBT_LIKES_COLLECTION 
from config.rabbitmq import channel
from middlewares.memeber_required import member_required
from middlewares.student_required import student_required
from bson import ObjectId,json_util
import requests

doubt_bp = Blueprint('doubt',__name__)

channel.queue_declare(queue='embedding_Q')
channel.queue_declare(queue='doubt_replay_Q')

@doubt_bp.route('/<class_id>',methods=['POST','GET'])
def ask_get_doubt(class_id):
    if request.method == "POST":
        return ask_doubt(class_id)
    elif request.method == "GET":
        return get_doubts(class_id)
    else:
        return jsonify({"success":False,"message":"method not allowed"}),409


@student_required
def ask_doubt(class_id,userdata):
    try:
        data = request.get_json()
        time = int(datetime.datetime.now().timestamp()*1000)
        doubt = {"user_id":ObjectId(userdata['userid']),"class_id":ObjectId(class_id),"doubt":data['doubt'],"time":time,"likes":0,"dislikes":0,"comments":0}
        res = db['doubts'].insert_one(doubt)

        channel.basic_publish(exchange='', routing_key='embedding_Q', body=json.dumps({"_id":str(res.inserted_id),"text":data['doubt']}))
        channel.basic_publish(exchange='', routing_key='doubt_answer_Q', body=json.dumps({"doubt_id":str(res.inserted_id),"doubt":data['doubt'],"ai_id":str(current_app.config['AI_ID'])}))

        print(" [x] Sent text")
        return jsonify({"success":True,"message":"doubt asked!"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@member_required
def get_doubts(class_id,userdata):
    try:
        skip = request.args.get('skip',default=0,type=int)
        doubts =  db['doubts'].aggregate([
            {'$match':{"class_id":ObjectId(class_id)}},
            {'$lookup':{
                'from':'users',
                'localField':"user_id",
                'foreignField':"_id",
                'as':'user_data'
            }},
            {"$unwind":"$user_data"},
            {'$lookup': {
            'from': 'doubt_likes',
            'let': {'doubtId': '$_id'},
            'pipeline': [
                {'$match': {
                    '$expr': {
                        '$and': [
                            {'$eq': ['$doubt_id', '$$doubtId']},
                            {'$eq': ['$user_id', ObjectId(userdata['userid'])]}  # Match current user
                        ]
                    }
                }},
                {'$limit': 1}  # Only return one document if it exists
            ],
            'as': 'user_like'
            }},
            {"$project":{
                "_id":1,
                "doubt":1,
                "likes":1,
                "dislikes":1,
                "number_of_comments":"$comments",
                "username":"$user_data.username",
                "profile_url":"$user_data.profile_url",
                "time":1,
                "user_reaction": {"$arrayElemAt": ["$user_like.type", 0]}
            }},
            {"$sort":{"time":-1}},
            {"$skip":skip},
            {"$limit":20},
        ])
        return jsonify({"success":True,"doubts":json.loads(json_util.dumps((doubts)))})
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@doubt_bp.route("/like/<class_id>/<doubt_id>",methods=['POST'])
@member_required
def like_doubt(class_id,doubt_id,userdata):
    try:
        existing = db[DOUBT_LIKES_COLLECTION].find_one({'user_id':ObjectId(userdata['userid']),"doubt_id":ObjectId(doubt_id)})
        if existing:
            if existing['type'] != "like":
                db[DOUBT_LIKES_COLLECTION].update_one({'_id':existing['_id']},{"$set":{"type":"like"}})
                db[DOUBTS_COLLECTION].update_one(
                                {'_id':ObjectId(doubt_id)},
                                {
                                    "$inc":{
                                        "likes":1,
                                        "dislikes":-1
                                    }
                                })
        else:
            db[DOUBT_LIKES_COLLECTION].insert_one({"user_id":ObjectId(userdata['userid']),"doubt_id":ObjectId(doubt_id),"type":"like"})
            db[DOUBTS_COLLECTION].update_one(
                                {'_id':ObjectId(doubt_id)},
                                {
                                    "$inc":{
                                        "likes":1,
                                    }
                                })
        return jsonify({"success":True,"message":"Doubt liked!"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@doubt_bp.route("/dislike/<class_id>/<doubt_id>",methods=['POST'])
@member_required
def dislike_doubt(class_id,doubt_id,userdata):
    try:
        existing = db[DOUBT_LIKES_COLLECTION].find_one({'user_id':ObjectId(userdata['userid']),"doubt_id":ObjectId(doubt_id)})
        if existing:
            if existing['type'] != "dislike":
                db[DOUBT_LIKES_COLLECTION].update_one({'_id':existing['_id']},{"$set":{"type":"dislike"}})
                db[DOUBTS_COLLECTION].update_one(
                                {'_id':ObjectId(doubt_id)},
                                {
                                    "$inc":{
                                        "likes":-1,
                                        "dislikes":1,
                                    }
                                })
        else:
            db[DOUBT_LIKES_COLLECTION].insert_one({"user_id":ObjectId(userdata['userid']),"doubt_id":ObjectId(doubt_id),"type":"dislike"})
            db[DOUBTS_COLLECTION].update_one(
                                {'_id':ObjectId(doubt_id)},
                                {
                                    "$inc":{
                                        "dislikes":1,
                                    }
                                })
        return jsonify({"success":True,"message":"Doubt disliked!"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@doubt_bp.route('/comment/<class_id>/<doubt_id>',methods=['POST','GET'])
def get_or_add_comment(class_id,doubt_id):
    if request.method == "POST":
        return add_comment(class_id,doubt_id)
    elif request.method == "GET":
        return get_comments(class_id,doubt_id)
    else:
        return jsonify({"success":False,"message":"method not allowed!"}),409

@member_required
def add_comment(class_id,doubt_id,userdata):
    try:
        data = request.get_json()
        time = int(datetime.datetime.now().timestamp()*1000)
        db[DOUBT_COMMENTS_COLLECTION].insert_one({"doubt_id":ObjectId(doubt_id),"user_id":ObjectId(userdata['userid']),"comment":data['comment'],"likes":0,"dislikes":0,"time":time}) 
        db[DOUBTS_COLLECTION].update_one({"_id":ObjectId(doubt_id)},
            {"$inc":{
                "comments":1
            }
        })
        return jsonify({"success":True,"message":"commented!"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500


@member_required
def get_comments(class_id,doubt_id,userdata):
    try:
        skip = request.args.get('skip',default=0,type=int)
        comments =  db[DOUBT_COMMENTS_COLLECTION].aggregate([
            {'$match':{"doubt_id":ObjectId(doubt_id)}},
            {'$lookup':{
                'from':'users',
                'localField':"user_id",
                'foreignField':"_id",
                'as':'user_data'
            }},
            {"$unwind":"$user_data"},
            {'$lookup': {
            'from': COMMENT_LIKES_COLLECTION,
            'let': {'commentId': '$_id'},
            'pipeline': [
                {'$match': {
                    '$expr': {
                        '$and': [
                            {'$eq': ['$comment_id', '$$commentId']},
                            {'$eq': ['$user_id', ObjectId(userdata['userid'])]}  # Match current user
                        ]
                    }
                }},
                {'$limit': 1}  # Only return one document if it exists
            ],
            'as': 'user_like'
            }},
            {"$project":{
                "_id":1,
                "comment":1,
                "likes":1,
                "dislikes":1,
                "username":"$user_data.username",
                "profile_url":"$user_data.profile_url",
                "time":1,
                "user_reaction": {"$arrayElemAt": ["$user_like.type", 0]}
            }},
            {"$sort":{"time":-1}},
            {"$skip":skip},
            {"$limit":20},
        ])
        return jsonify({"success":True,"comments":json.loads(json_util.dumps((comments)))})
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@doubt_bp.route("/comment/like/<class_id>/<comment_id>",methods=['POST'])
@member_required
def like_comment(class_id,comment_id,userdata):
    try:
        existing = db[COMMENT_LIKES_COLLECTION].find_one({'user_id':ObjectId(userdata['userid']),"comment_id":ObjectId(comment_id)})
        if existing:
            if existing['type'] != "like":
                db[COMMENT_LIKES_COLLECTION].update_one({'_id':existing['_id']},{"$set":{"type":"like"}})
                db[DOUBT_COMMENTS_COLLECTION].update_one(
                                {'_id':ObjectId(comment_id)},
                                {
                                    "$inc":{
                                        "likes":1,
                                        "dislikes":-1
                                    }
                                })
            else:
                db[COMMENT_LIKES_COLLECTION].delete_one({"_id":ObjectId(existing['_id'])})
                db[DOUBT_COMMENTS_COLLECTION].update_one(
                                {'_id':ObjectId(comment_id)},
                                {
                                    "$inc":{
                                        "likes":-1,
                                    }
                                })
        else:
            db[COMMENT_LIKES_COLLECTION].insert_one({"user_id":ObjectId(userdata['userid']),"comment_id":ObjectId(comment_id),"type":"like"})
            db[DOUBT_COMMENTS_COLLECTION].update_one(
                                {'_id':ObjectId(comment_id)},
                                {
                                    "$inc":{
                                        "likes":1,
                                    }
                                })
        return jsonify({"success":True,"message":"Doubt liked!"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@doubt_bp.route("/comment/dislike/<class_id>/<comment_id>",methods=['POST'])
@member_required
def dislike_comment(class_id,comment_id,userdata):
    try:
        existing = db[COMMENT_LIKES_COLLECTION].find_one({'user_id':ObjectId(userdata['userid']),"comment_id":ObjectId(comment_id)})
        print(existing)
        if existing:
            if existing['type'] != "dislike":
                db[COMMENT_LIKES_COLLECTION].update_one({'_id':existing['_id']},{"$set":{"type":"dislike"}})
                db[DOUBT_COMMENTS_COLLECTION].update_one(
                                {'_id':ObjectId(comment_id)},
                                {
                                    "$inc":{
                                        "likes":-1,
                                        "dislikes":1,
                                    }
                                })
            else:
                db[COMMENT_LIKES_COLLECTION].delete_one({"_id":ObjectId(existing['_id'])})
                db[DOUBT_COMMENTS_COLLECTION].update_one(
                                {'_id':ObjectId(comment_id)},
                                {
                                    "$inc":{
                                        "dislikes":-1,
                                    }
                                })
        else:
            db[COMMENT_LIKES_COLLECTION].insert_one({"user_id":ObjectId(userdata['userid']),"comment_id":ObjectId(comment_id),"type":"dislike"})
            db[DOUBT_COMMENTS_COLLECTION].update_one(
                                {'_id':ObjectId(comment_id)},
                                {
                                    "$inc":{
                                        "dislikes":1,
                                    }
                                })
        return jsonify({"success":True,"message":"Comment disliked!"})
    except Exception as e:
        print(e)
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@doubt_bp.route("/search/<class_id>",methods=['POST'])
@member_required
def search_doubts(class_id,userdata):
    data = request.get_json()
    query = data['query']
    res = requests.post("http://localhost:8001/embed",json={"text":query})
    print(res)
    print(res.json().get('embedding',None))
    pipeline = [
        {"$vectorSearch":{
            "index":"doubts_search",
            "path":"embedding",
            "queryVector":res.json().get('embedding',None),
            "numCandidates":100,
            "limit":5,
            "filter":{"class_id":ObjectId(class_id)}
        }}
    ]
    results = db[DOUBTS_COLLECTION].aggregate(pipeline)
    return jsonify({"success":True,"results":json.loads(json_util.dumps(results))})
