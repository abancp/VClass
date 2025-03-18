from flask import Flask, jsonify
import flask
from flask_cors import CORS
from blueprints import doubt
from config.mongodb import client ,db
from blueprints.auth import auth_bp
from blueprints.class_bp import class_bp
from blueprints.announcement import ann_bp
from blueprints.work import work_bp
from blueprints.event import event_bp 
from blueprints.ai import ai_bp
from blueprints.doubt import doubt_bp
from blueprints.resources import src_bp
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:3000","http://192.168.124.235:3000","https://vclass-xi.vercel.app"],
    allow_headers=[
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "User-Agent",
    "Referer",
    "Cache-Control",
    "Pragma",
]
,
    supports_credentials=True
)

app.register_blueprint(auth_bp)
app.register_blueprint(class_bp,url_prefix='/class')
app.register_blueprint(work_bp,url_prefix='/work')
app.register_blueprint(ann_bp,url_prefix='/ann')
app.register_blueprint(ai_bp,url_prefix='/ai')
app.register_blueprint(src_bp,url_prefix='/src')
app.register_blueprint(event_bp,url_prefix='/event')
app.register_blueprint(doubt_bp,url_prefix='/doubt')

with app.app_context():
    try:
        client.admin.command('ping')
        print("Mongodb Connected !")
        ai = db['users'].find_one({"email":"ai@vclass.com"})
        if ai:
            app.config['AI_ID'] = ai['_id']
        else:
            res = db['users'].insert_one({"username":"VClass AI","email":"ai@vclass.com","student":[],"teacher":[],"profile_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT6mB9psRLZ1w3gSxezEl5ryhVBL3lGn6Yhw&s"})
            app.config['AI_ID'] = res.inserted_id
        print(type(app.config['AI_ID']),app.config['AI_ID'])
            
    except Exception as e:
        print("Error connecting mongodb : "+str(e))

@app.route("/")
def home():
    return jsonify({"message":"welcome to VClass server ( flask - "+flask.__version__ +" )","success":True})


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)
