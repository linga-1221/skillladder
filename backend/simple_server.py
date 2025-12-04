from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import hashlib
import os

app = Flask(__name__)
CORS(app)

USERS_FILE = "users.json"

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_users(users):
    try:
        with open(USERS_FILE, "w") as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print(f"Error saving users: {e}")

@app.route('/register/', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")
        
        if not all([email, password, role]):
            return jsonify({"status": "error", "detail": "Missing registration fields."})
        
        users = load_users()
        if any(u["email"] == email for u in users):
            return jsonify({"status": "error", "detail": "User already exists."})
        
        user_data = {
            "email": email, 
            "password": hash_password(password), 
            "role": role, 
            "history": []
        }
        
        if role == "job_seeker":
            user_data.update({
                "name": data.get("name", ""),
                "phone": data.get("phone", ""),
                "graduation_year": data.get("graduationYear", ""),
                "study_year": data.get("studyYear", ""),
                "degree_type": data.get("degreeType", ""),
                "college_name": data.get("collegeName", "")
            })
        
        users.append(user_data)
        save_users(users)
        return jsonify({"status": "registered", "email": email, "role": role})
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({"status": "error", "detail": "Registration failed."})

@app.route('/login/', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        
        if not all([email, password]):
            return jsonify({"status": "error", "detail": "Missing login fields."})
        
        users = load_users()
        user = next((u for u in users if u["email"] == email and u["password"] == hash_password(password)), None)
        
        if not user:
            return jsonify({"status": "error", "detail": "Invalid credentials."})
        
        return jsonify({"status": "success", "email": user["email"], "role": user["role"]})
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"status": "error", "detail": "Login failed."})

@app.route('/')
def home():
    return jsonify({"message": "Backend is running!"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)