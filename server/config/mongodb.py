from pymongo import MongoClient
client = MongoClient("mongodb://localhost:27017")
db = client['VClass']
users = db['users']
classes = db['classes']
