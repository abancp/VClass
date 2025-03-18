from torch import embedding
from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
import re
import pika
import json
from pymongo import MongoClient
import os
from bson import ObjectId
import asyncio
import uvicorn
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

model = SentenceTransformer('all-MiniLM-L6-v2')

client = MongoClient(os.getenv("MONGO_URI"))
print(os.getenv("MONGO_URI"))
db = client['VClass']


def preprocess_text(text):
    text = text.lower()  
    text = text.replace("\n", " ") 
    text = re.sub(r'\s+', ' ', text).strip() 
    return text


@app.post("/embed")
async def convert_embedding(data:dict):
    text = data.get("text")
    if not text:
        return {"success":False,"error":"text is required"}
    embedding = model.encode(preprocess_text(text)).tolist()
    return {"embedding":embedding}


def rabbitmq_consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()
    channel.queue_declare(queue="embedding_Q")
    def callback(ch,method,properties,body):
        try:
            data = json.loads(body)
            print(data)
            _id = data.get("_id",None)
            text = data.get("text",None)
            if not _id or not text: 
                print("- X - Text ot _id not given")
            embedding = model.encode(text).tolist()
            print("embedding : ",embedding)
            print(db['doubts'].find_one({"_id":ObjectId(_id)}))
            db['doubts'].update_one({"_id":ObjectId(_id)},{"$set":{"embedding":embedding}})
            ch.basic_ack(delivery_tag=method.delivery_tag)
        except Exception as e:
            print(e)
    channel.basic_consume(queue="embedding_Q",on_message_callback=callback)
    print("Rabbit MQ Consuming")
    channel.start_consuming()

async def main():
    loop = asyncio.get_running_loop()
    task1 = loop.run_in_executor(None,rabbitmq_consumer)
    config = uvicorn.Config(app,host="0.0.0.0",port=8001)
    server = uvicorn.Server(config)
    task2 = asyncio.create_task(server.serve())
    await asyncio.gather(task1,task2)

if __name__ == "__main__":
    asyncio.run(main())
