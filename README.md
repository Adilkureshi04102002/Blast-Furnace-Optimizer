# Optimization of Blast Furnace Parameters using Artificial Immune System


### SSIT-sem_7-Batch-2022

A blast furnace is a type of metallurgical furnace used for smelting to produce industrial
metals, generally pig iron, but also others such as lead or copper. Blast refers to the
combustion air being "forced" or supplied above atmospheric pressure.

Inside the blast furnace a series of chemical and thermal reactions takes place. Many
variables are involved as a process so as because of complexity exact mathematical
process is difficult to model. In the present days many iron makers across the world wide
used the modern technique to enhance the efficiency of the blast furnace by improving
the quality of the molten iron.

In this project, we are going to implement an algorithm to solve multiobjective
optimization problems using immune system algorithm. We will see how promising the
result of this algorithm is. It is capable of learning, it learns to recognize patterns that it
has been shown in the past and its global behaviour is an emergent property of many
local interactions. We will use this algorithm optimizing blast furnace parameters.

The process chemistry and the transport phenomena in blast furnaces are highly complex
and despite decades of intensive research, a fully reliable analytical model for the blast
furnace is yet to emerge. Therefore, data-driven models are of vital importance for
throwing light on the complex interrelations between variables in the process.

A modern web application for optimizing blast furnace parameters using an Artificial Immune System approach.

## Features

- User authentication (login/register)
- Parameter input interface
- Real-time prediction
- Modern, responsive UI
- Secure API endpoints

## Setup

### Backend Setup

1. Create a Python virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Run the Flask backend:

```bash
python app.py
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install Node.js dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

1. Register a new account or login with existing credentials
2. Enter the blast furnace parameters in the dashboard
3. Click "Predict" to get optimization results
4. View the prediction results below the form

## API Endpoints

- POST `/api/register` - Register new user
- POST `/api/login` - User login
- POST `/api/predict` - Get parameter predictions (requires authentication)

## Technologies Used

- Backend:

  - Flask
  - SQLAlchemy
  - JWT Authentication
  - NumPy
  - Pandas
- Frontend:

  - React
  - TypeScript
  - Tailwind CSS
  - Axios
  - React Router
