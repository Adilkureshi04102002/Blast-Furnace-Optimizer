from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import timedelta
from utility.readCsv import readCsv, getVariableObjective
from utility.paretoDetermination import pareto
import numpy as np

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/api/plots')
@jwt_required()
def get_plots():
    plots_dir = os.path.join(os.path.dirname(__file__), 'utility', 'plots')
    plots = []
    for filename in os.listdir(plots_dir):
        if filename.endswith('.png'):
            name = os.path.splitext(filename)[0]
            title = name.replace('_', ' ').title()
            plots.append({
                'filename': filename,
                'title': title,
                'url': f'/api/plots/{filename}'
            })
    return jsonify(plots)

@app.route('/api/plots/<path:filename>')
@jwt_required()
def serve_plot(filename):
    plots_dir = os.path.join(os.path.dirname(__file__), 'utility', 'plots')
    return send_from_directory(plots_dir, filename)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not all(k in data for k in ['username', 'password', 'email']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        password=hashed_password,
        email=data['email']
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ['username', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.username)
        return jsonify({
            'access_token': access_token,
            'username': user.username
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict():
    try:
        data = request.get_json()
        
        # Load the model data using absolute path
        data_file = os.path.join(os.path.dirname(__file__), 'data', 'meta_data.csv')
        df = readCsv(data_file)
        variables, solutions, minVariable, maxVariable = getVariableObjective(df)
        
        # Get non-dominated solutions
        ND, D, ND_sol, D_sol = pareto(variables, solutions, ['min','max','max','min','max','min','min','min'])
        
        result = {
            'prediction': ND_sol[0].tolist() if len(ND_sol) > 0 else None,
            'message': 'Prediction successful',
            'variables': variables.tolist() if isinstance(variables, np.ndarray) else variables,
            'solutions': solutions.tolist() if isinstance(solutions, np.ndarray) else solutions
        }
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 