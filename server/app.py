from flask import Flask, jsonify
import flask
from flask_cors import CORS
from config.mongodb import client 
from blueprints.auth import auth_bp
from blueprints.class_bp import class_bp

app = Flask(__name__)
CORS(app,origins=["http://localhost:3000"],allow_headers="*",supports_credentials=True)
app.config['JWT_SECRET'] =  "JA^&%&D%ASB&*ASvssdfhhAnbhsfu6a56sf8fhaO^!@#$%$"

app.register_blueprint(auth_bp)
app.register_blueprint(class_bp,url_prefix='/class')

with app.app_context():
    try:
        client.admin.command('ping')
        print("Mongodb Connected !")
    except Exception as e:
        print("Error connecting mongodb : "+str(e))

@app.route("/")
def home():
    return jsonify({"message":"welcome to VClass server ( flask - "+flask.__version__ +" )","success":True})


if __name__ == '__main__':
    app.run()
