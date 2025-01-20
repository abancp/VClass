from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
print(os.getenv("MONGO_URI"))
client = MongoClient(os.getenv("MONGO_URI"))
db = client['VClass']
users = db['users']
classes = db['classes']
works = db['works']
