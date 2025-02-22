import datetime
import io
import pandas as pd
from pika.spec import methods
from bson import json_util
from flask import Blueprint, jsonify,request, send_file
from config.mongodb import classes,users,works,submits
from middlewares.memeber_required import member_required
from middlewares.student_required import student_required
from middlewares.teacher_required import teacher_required
import json
from bson.objectid import ObjectId
from config.rabbitmq import channel

work_bp = Blueprint('work',__name__)

@work_bp.route("/add/<work_type>",methods=['POST'])
@teacher_required
def create_work(work_type,userdata):
    try:
        data = request.get_json()
        data['teacher'] = ObjectId(userdata['userid'])
        data['class_id'] = ObjectId(data['class_id'])
        data['teacher_name'] = userdata['username']
        data['type'] = work_type
        data['accept_submits'] = True
        data['time'] = int(datetime.datetime.now().timestamp()*1000)
        print(data)
        works.insert_one(data)
        return jsonify({"success":True,"message":"Task assigned!"})
    except:
        return jsonify({"success":False,"message":"Something went wrong!"}),500


@work_bp.route("/works/<class_id>",methods=['GET'])
@member_required
def get_works(class_id,userdata):
    try:
        skip = request.args.get('skip',default=0,type=int)
        works_data = works.find({"class_id":ObjectId(class_id)}).sort({"time":-1}).limit(10).skip(skip)
        return jsonify({"success":True,"works":json.loads(json_util.dumps(works_data))})
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)})


@work_bp.route("/submit/<class_id>/<work_id>",methods=['POST'])
@student_required
def submit_work(class_id,work_id,userdata):
        try:
            data = request.get_json()
            time = int(datetime.datetime.now().timestamp()*1000)
            count = submits.count_documents({"work_id":ObjectId(work_id),"user_id":ObjectId(userdata['userid'])})
            work = works.find_one({"_id":ObjectId(work_id)})
            if not work['accept_submits']:
                return jsonify({"success":False,"message":"the work is not accepting submissions now!"})
            if work['due_date'] < int(datetime.datetime.now().timestamp() *1000):
                return jsonify({"success":False,"message":"time end for this work!"})
            if count > 0 and not work['can_edit']:
                return jsonify({"success":False,"message":"you allready submitted!"})
            mark = 0
            complete_val = True
            marks = {}
            if work['type'] == "quiz":
                for question_index,question in enumerate(work['quiz']):
                    print(data)
                    print(question_index,question)
                    if 'answer' in question and str(question_index) in data:
                        if question['type'] == "MCQ":
                            if data[str(question_index)] == question['answer']:
                                marks[str(question_index)] = question['mark']
                                mark+=question['mark']
                        elif question['type'] == "SHORT":
                            if 'case_sensitive' in question and question['case_sensitive']:
                                if data[str(question_index)] == question['answer']:
                                    marks[str(question_index)] = question['mark']
                                    mark+=question['mark']
                            else:
                                if data[str(question_index)].lower() == question['answer'].lower():
                                    marks[str(question_index)] = question['mark']
                                    mark+=question['mark']

                                
                        elif question['type'] == "DESCRIPTIVE":
                            channel.basic_publish(exchange='', routing_key='Descriptive_Q', body=json.dumps({"correct":question['answer'],"student":data[str(question_index)],"index":question_index,"work_id":work_id,"user_id":userdata['userid'],"mark":question['mark']}))
                            print(" [x] Passed to Descriptive Evaluation AI")
                            complete_val = False
                        else:
                            complete_val = False
            elif work['type'] == "assignment":
                complete_val = False 
                            
            print(mark)
            if count > 0:
                submits.delete_many({"work_id":ObjectId(work_id),"user_id":ObjectId(userdata['userid'])})
            submits.insert_one({"work_id":ObjectId(work_id),"class_id":ObjectId(class_id),"user_id":ObjectId(userdata['userid']),"response":data,"marks":marks,"mark":mark,"complete_val":complete_val,"time":time})
            return jsonify({"success":True,"message":"Work submitted!"})
        except Exception as e :
            print(e)
            return jsonify({"success":False,"message":"something went wrong!","error":str(e)}),500

@work_bp.route("/<class_id>/<work_id>",methods=['GET'])
@member_required
def get_work(class_id,work_id,userdata):
    try:
        work = works.find_one({"_id":ObjectId(work_id)})
        if 'quiz' in work:
            for q in work['quiz']:
                if 'answer' in q:
                    del q['answer']
        class_ = classes.find_one({"_id":ObjectId(class_id)},{"name":1})
        if userdata['role'] == "teacher":
            return jsonify({"success":True,"work":json.loads(json_util.dumps(work))})
        else:
            if work['analysis']:
                del work['analysis']
            return jsonify({"success":True,"class":json.loads(json_util.dumps(class_)),"work":json.loads(json_util.dumps(work))})
    except Exception as e:
        return jsonify({"Success":False,"message":"something went wrong!","error":str(e)}),500
   
@work_bp.route("/submits/<class_id>/<work_id>",methods=['GET'])
@teacher_required
def get_submits(class_id,work_id,userdata):
    try:
        submissions = submits.aggregate([
    {
        "$match": {
            "work_id": ObjectId(work_id)
        }
    },
    {
        "$lookup": {
            "from": "users",
            "let": { "userIdStr": { "$toObjectId": "$user_id" } },  
            "pipeline": [
                { "$match": { "$expr": { "$eq": [ "$_id", "$$userIdStr" ] } } }
            ],
            "as": "user_info"
        }
    },
    {
        "$unwind": "$user_info" },
    {
        "$project": {
            "_id": 1,
            "work_id": 1,
            "type": 1,
            "class_id": 1,
            "data": 1,
            "time": 1,
            "user_id": 1,
            "response":1,
            "complete_val":1,
            "mark":1,
            "marks":1,
            "username": "$user_info.username" 
            }
    }
])
        print(submissions)
        class_ = classes.find_one({"_id":ObjectId(class_id)},{"number_of_students":1})
        if not submissions:
            return jsonify({"success":True,"submits":[]})
        return jsonify({"success":True,"submits":json.loads(json_util.dumps(submissions)),"total_students":class_['number_of_students']})
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)})


@work_bp.route("/<class_id>/<work_id>/accept-submits",methods=['POST'])
@teacher_required
def change_accept_submits(class_id,work_id,userdata):
    try:
        data = request.get_json()
        print(work_id)
        works.update_one({"_id":ObjectId(work_id)},{"$set":{"accept_submits":data['accept_submits']}})
        return jsonify({"success":True,"message":"submits is accepting now!" if data['accept_submits'] else "submits is not accepting now!"})
    except Exception as e:
        print(e)
        return jsonify({"success":True,"message":"something went wrong","error":str(e)})


@work_bp.route('/export-excel/<class_id>',methods=['GET'])
@teacher_required
def export_submits(class_id,userdata):
    pipeline = [
  { 
    "$match": { "_id": ObjectId(class_id) } 
  },

  { 
    "$lookup": {
      "from": "users",
      "localField": "students",
      "foreignField": "_id",
      "as": "student_details"
    }
  },

  { 
    "$lookup": {
      "from": "works",
      "localField": "_id",
      "foreignField": "class_id",
      "as": "works"
    }
  },

  { 
    "$unwind": "$student_details" 
  },

  { 
    "$lookup": {
      "from": "submits",
      "let": { "student_id": "$student_details._id" },
      "pipeline": [
        { 
          "$match": { 
            "$expr": { "$eq": ["$user_id", "$$student_id"] } 
          } 
        },
        { 
          "$project": { "work_id": 1, "mark": 1 } 
        }
      ],
      "as": "submissions"
    }
  },

  { 
    "$project": {
      "_id": 0,
      "name": "$student_details.username",
      "marks": {
        "$arrayToObject": {
          "$map": {
            "input": "$works",
            "as": "work",
            "in": [
              "$$work.title",
              {
                "$let": {
                  "vars": { 
                    "matchingSubmit": {
                      "$arrayElemAt": [
                        {
                          "$filter": {
                            "input": "$submissions",
                            "as": "sub",
                            "cond": { "$eq": ["$$sub.work_id", "$$work._id"] }
                          }
                        },
                        0
                      ]
                    }
                  },
                  "in": { "$ifNull": ["$$matchingSubmit.mark", 0] }
                }
              }
            ]
          }
        }
      }
    }
  },

  { 
    "$replaceRoot": { 
      "newRoot": { "$mergeObjects": ["$$ROOT", "$marks"] } 
    }
  },

  { 
            "$project": {"marks": 0 } }
]



    data = list(classes.aggregate(pipeline))# Exclude MongoDB "_id" field
    print(data)
    #data = list(submits.find({"class_id":ObjectId(class_id)}, {"_id": 0})) 
    df = pd.DataFrame(data)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Data')
    
    output.seek(0)
    return send_file(output, download_name="data.xlsx", as_attachment=True, mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

