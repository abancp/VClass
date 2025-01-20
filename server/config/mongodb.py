from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client['VClass']
users = db['users']
classes = db['classes']
works = db['works']
