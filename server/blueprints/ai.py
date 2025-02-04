from flask import Blueprint, jsonify, request
import google.generativeai as genai
from middlewares.jwt_protect import jwt_required
from middlewares.memeber_required import member_required
from config.genai import model

ai_bp = Blueprint('ai',__name__)

@ai_bp.route('/gen',methods=['POST'])
@jwt_required
def gen(userdata):
    try:
        data = request.get_json()
        system_prompt = "you are a ai assinstand for a virtual class named VClass . users asking questions by prompt. generate positive response depends on users role,name,and prompt"
        prompt = system_prompt+ f"[ role :{userdata['role']} ,username:{usedata['username']}, prompt:{data['prompt']} ]"
        response = model.generate_content(prompt)
        return jsonify({"success":True,"response":response.text})
    except Exception as e:
        return jsonify({"success":False,"message":"something went wrong!","error":str(e)})
