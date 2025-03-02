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
anns= db['anns']
submits = db['submits']
srcs = db['srcs']
events = db['events']

DOUBT_LIKES_COLLECTION = 'doubt_likes'
USERS_COLLECTION = 'users'
DOUBTS_COLLECTION = 'doubts'
DOUBT_COMMENTS_COLLECTION = 'doubt_comments'
COMMENT_LIKES_COLLECTION = 'comment_likes'
