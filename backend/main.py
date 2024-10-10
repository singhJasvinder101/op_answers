# app.py - Flask API
from flask import Flask, request, jsonify
import os
import google.generativeai as genai
from flask_cors import CORS
from dotenv import load_dotenv 

load_dotenv()
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

genai.configure(api_key = os.environ['GOOGLE_API_KEY'])

model = genai.GenerativeModel('models/gemini-1.5-flash')

@app.route('/', methods = ['GET'])
def hello():
    return jsonify({ 'message': 'working...' })

@app.route('/generate_answer', methods = ['POST'])
def generate_answer():
    data = request.json
    question = data.get('question')

    if not question:
        return jsonify({ 'error': 'No question provided' }), 400

    prompt_template = f"answer question below, the question may be of multiple choice or not you must give too the point answer don't give too much detail also return the correct option like A/B/C/D if possible format of response should be A/B/C/D/E - Text of correct option:\n{question}"

    generation_config = genai.types.GenerationConfig(
        top_p = 0.95,
        top_k = 64,
        temperature = 1,
        max_output_tokens = 8192
    )

    response = model.generate_content(
        prompt_template,
        generation_config = generation_config
    )

    return jsonify({ 'answer': response.text })

if __name__ == '__main__':
    app.run(debug = True)
