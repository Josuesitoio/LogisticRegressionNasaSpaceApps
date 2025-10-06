Exoplanet Candidate Prediction API
Overview
This project is a full-stack application designed to predict whether an object of interest from the Kepler mission is a confirmed exoplanet or a false positive. It utilizes a trained logistic regression model served via a Python Flask API, with a web-based interface for user interaction. The frontend is designed to provide a transparent "glass-box" explanation for the model's prediction.

Project Architecture
The application is built on a client-server architecture, separating the user interface from the machine learning logic.

Frontend (Client-Side):

A single-page web interface (formulario.html) built with HTML, TailwindCSS, and vanilla JavaScript.

Features a form for users to input the telemetry data of a potential exoplanet candidate.

Dynamically displays the prediction results, confidence score, and a breakdown of the evidence supporting or opposing the classification.

Communicates with the backend via an asynchronous fetch API call.

Backend (Server-Side):

A RESTful API built with Python and the Flask framework (app.py).

Exposes a single endpoint (/predict) that accepts POST requests with JSON data.

Loads a pre-trained StandardScaler (escalador_kepler_equilibrado.pkl) and a LogisticRegression model (modelo_kepler_equilibrado.pkl) using joblib.

Pre-processes the incoming data, feeds it to the model for prediction, and returns the result as a JSON response.

How It Works
The end-to-end workflow for a prediction is as follows:

A user enters the data for an exoplanet candidate into the fields on the formulario.html web page.

Upon clicking the "Decode Signal" button, a JavaScript function gathers the form data into a JSON object.

An asynchronous fetch request is sent from the browser to the /predict endpoint of the backend Flask API.

The Flask application receives the JSON data. It validates that all required features are present.

The raw data is loaded into a Pandas DataFrame and processed by the pre-trained StandardScaler to normalize the feature values.

The scaled data is then passed to the trained LogisticRegression model to make a prediction.

The model outputs a classification (CONFIRMED or FALSE POSITIVE) and calculates the confidence score based on the prediction probabilities.

The API sends this prediction and confidence score back to the frontend in a JSON format.

The client-side JavaScript receives the response and dynamically updates the DOM to display the final verdict and the reasoning behind it.

Key Files in the Repository
formulario.html: The core frontend file containing the HTML structure, form inputs, and all client-side JavaScript logic for handling user interaction and API communication.

app.py: The backend Flask server. It handles loading the models, defining the API endpoint, and processing prediction requests.

modelo_kepler_equilibrado.pkl: The serialized, pre-trained logistic regression model file.

escalador_kepler_equilibrado.pkl: The serialized StandardScaler object used to preprocess data in the exact same way as the model's training data.

requirements.txt: A list of all Python dependencies required to run the backend server (e.g., Flask, pandas, scikit-learn).

Procfile: A file used by hosting platforms like Render or Heroku to specify the command needed to start the web server (e.g., web: gunicorn app:app).

Local Setup and Deployment
Prerequisites
Python 3.x

pip (Python package installer)

Git

Running Locally
Clone the repository:

Bash

git clone <your-repository-url>
cd <your-repository-name>
Set up the backend:

Create and activate a virtual environment:

Bash

python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
Install the required dependencies:

Bash

pip install -r requirements.txt
Run the Flask server:

Bash

python app.py
The backend will now be running on http://127.0.0.1:5000.

Run the frontend:

Open the formulario.html file directly in your web browser. The form will be fully functional as long as the backend server is running.

Deployment
This project is intended to be deployed with a separated frontend and backend.

Backend Deployment:

Deploy the Flask application (containing app.py, the .pkl files, requirements.txt, and Procfile) to a web service provider that supports Python, such as Render or Heroku.

The service will use the Procfile to start the Gunicorn server and make the API accessible via a public URL.

Frontend Deployment:

Host the formulario.html file on a static site hosting service like GitHub Pages.

Crucially, you must modify the fetch URL in the JavaScript section of formulario.html from the local http://127.0.0.1:5000/predict to your live backend URL provided by Render or Heroku.
