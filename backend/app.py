from flask import Flask, request, jsonify
from flask_cors import CORS
from backend import MedicineRecommender

app = Flask(__name__)
CORS(app)

mr = MedicineRecommender()

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    symptoms = data.get('symptoms', '')
    age = int(data.get('age', 0))
    gender = data.get('gender', 'male')
    pregnancy = data.get('pregnancy', 'no')
    feeding = data.get('feeding', 'no')
    duration = data.get('duration', '')
    result = mr.recommend(symptoms, age, gender, pregnancy, feeding, duration)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

