import pika, sys, os,json
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import xgboost as xgb
import pandas as pd
from sentence_transformers import SentenceTransformer, util
from transformers import pipeline
from bson import ObjectId
import re

load_dotenv()
print(os.getenv("MONGO_URI"))
client = MongoClient(os.getenv("MONGO_URI"))

db = client['VClass']
users = db['users']
classes = db['classes']
works = db['works']
submits = db['submits']

s_model = SentenceTransformer('all-MiniLM-L6-v2')
nli_model = pipeline("text-classification", model="typeform/distilbert-base-uncased-mnli")

def preprocess_text(text):
    text = text.lower()  
    text = text.replace("\n", " ") 
    text = re.sub(r'\s+', ' ', text).strip() 
    return text

def calculate_similarity(correct_answer, student_answer):
    embeddings = s_model.encode([correct_answer, student_answer], convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(embeddings[0], embeddings[1])
    return similarity.item() * 100 

def check_contradiction(correct_answer, student_answer):
    result = nli_model(f"{correct_answer} [SEP] {student_answer}")
    label = result[0]['label'].lower()
    label_mapping = {
        "entailment": 0,
        "neutral": 1,
        "contradiction": 2
    }

    return label_mapping.get(label, -1) 

model = xgb.XGBRegressor()
model.load_model(os.path.abspath("xgboost_model.json"))



def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost',heartbeat=0))
    channel = connection.channel()

    channel.queue_declare(queue='Descriptive_Q')

    def callback(ch, method, properties, body):
        print(f" [x] Received {body}")
        data = json.loads(body.decode('utf-8'))
        correct = data['correct']
        student = data['student']
        sim = calculate_similarity(correct,student)
        con = check_contradiction(correct,student)
        print(sim,con)
        new_data = pd.DataFrame({
            "similarity_score": [sim],
            "contradiction_score": [con]
        })
        bias = 0.1 if con == 0 else -0.1 if con == 2 else 0
        predicted_score = model.predict(new_data)[0]
        mark = data['mark'] * predicted_score 
        mark = mark +  (bias*mark)
        mark = max(data['mark'],min(0,mark))
        print(mark)
        is_completed = False
        submit = submits.find_one({"work_id":ObjectId(data['work_id']),"user_id":ObjectId(data['user_id'])},{"_id":1,"response":1,"marks":1,"mark":1})
        total_mark = submit['mark'] + mark 
        if len(submit['response'])-1 <= len(submit['marks']):
            is_completed = True
        submits.update_one({"work_id":ObjectId(data['work_id']),"user_id":ObjectId(data['user_id'])},{"$set":{"marks."+str(data['index']):mark,"mark":int(total_mark),"complete_val":is_completed}})        
    channel.basic_consume(queue='Descriptive_Q', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL-C')
    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
