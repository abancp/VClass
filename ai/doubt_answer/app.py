import datetime
import pika
import json
from pymongo import MongoClient
import os
from bson import ObjectId
from dotenv import load_dotenv
from genai import model

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
print(os.getenv("MONGO_URI"))
db = client['VClass']

def callback(ch,method,properties,body):
    try:
        data = json.loads(body)
        print(data)
        doubt_id = data.get("doubt_id",None)
        doubt = data.get("doubt",None)
        ai_id = data.get("ai_id",None)
        if not doubt_id or not doubt or not ai_id: 
            print("- X - Text ot _id not given")
        response = model.generate_content("You are a doubt answer ai in a virtual classroom app ,generate the answer only .  please answet this doubt : "+doubt)
        print(response.text)
        time = int(datetime.datetime.now().timestamp()*1000)
        db['doubt_comments'].insert_one({"doubt_id":ObjectId(doubt_id),"user_id":ObjectId(ai_id),"comment":response.text,"likes":0,"dislikes":0,"time":time}) 
        db['doubts'].update_one({"_id":ObjectId(doubt_id)},
            {"$inc":{
                "comments":1
            }
        })
    except Exception as e:
        print(e)
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)

connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
channel = connection.channel()
channel.queue_declare(queue="doubt_answer_Q")
channel.basic_consume(queue="doubt_answer_Q",on_message_callback=callback)
print("Rabbit MQ Consuming")
channel.start_consuming()
