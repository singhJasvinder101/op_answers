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

    prompt_template = f"""You are the most most intelligent human computer in the world who can solve very advance mathematical questions. so you will be given very important tasks to help the student in their tests and carefully answer all you can take your time because precision to answer matters alot

    Questions can belong to these topics English, Regional Language(s), Maths, Science, Social Sciences, Physical Education, Computer Basics, Arts, Electronics
    
    Solve the question carefully. The question may involve logical reasoning, factual data, or mathematical calculations, so ensure the answer is accurate. Also properly analyze the options

    For multiple-choice questions, return the correct option and remember answer must match from options only (for MCQ's) don't create your own new options

    If you have even a little doubt then please tell but don't give wrong answers pleasee !! recheck your answer, all calculations and all formulas thrice before giving correct answer

    Now return the answer in format: correct option with *text of answer of only 1 line*  if MCQ else small and to the point *text of answer of only 1 line* in both cases answers and Rate the difficult level of question
    Question: {question}"""


    generation_config = genai.types.GenerationConfig(
        top_p=0.95,  # required probability
      top_k=64,   
      temperature=1, 
      max_output_tokens=8192  
    )

    response = model.generate_content(
        prompt_template,
        generation_config = generation_config
    )

    return jsonify({ 'answer': response.text })

if __name__ == '__main__':
    app.run(debug = True)
