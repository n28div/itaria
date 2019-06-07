from flask import Flask, request, send_file, jsonify
from os import environ, path
import requests
from datetime import datetime, timedelta
import threading
import json

API_KEY = environ.get('API_KEY', 'DEBUG')
BASE_itAIRQ_URL = 'https://itairq.herokuapp.com/api/v1'

app = Flask(__name__)

def fetch_dataset(date):
    """
    Fetch date from itAIRQ

    :param date: The date of interest
    """
    date_fmt = date.strftime('%Y/%m/%d')
    date_path_fmt = date.strftime('%Y%m%d.json')
    res = requests.get(f'{BASE_itAIRQ_URL}/{date_fmt}')
    base_path = path.dirname(path.realpath(__name__))
    dataset_path = path.join(base_path, 'datasets', date_path_fmt)

    if res.status_code == 200:
        # data fetched save it to the disk
        with open(dataset_path, 'w') as f: 
            json.dump(json.loads(res.text), f)

def get_dataset(date):
    """
    Get data from local directory dataset

    :param date: The date of interest
    """
    date_path_fmt = date.strftime('%Y%m%d.json')
    base_path = path.dirname(path.realpath(__name__))
    dataset_path = path.join(base_path, 'datasets', date_path_fmt)

    if path.exists(dataset_path):
        # data fetched save it to the disk
        with open(dataset_path, 'r') as f: 
            return json.load(f)
    else:
        return None

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/today')
def today_data():
    # Check if dataset is available
    today = datetime.now()
    dataset = get_dataset(today)

    if dataset is not None:
        return '', 404
    else:
        return jsonify(dataset), 200

@app.route('/yesterday')
def yesterday_data():
    # Check if dataset is available
    today = datetime.now()
    yesterday = today - timedelta(days=1)
    dataset = get_dataset(yesterday)

    if dataset is not None:
        return '', 404
    else:
        return jsonify(dataset), 200

@app.route('/<int:year>/<int:month>/<int:day>')
def custom_data(year, month, day):
    # Check if dataset is available
    date = datetime(day=day, year=year, month=month)
    dataset = get_dataset(date)

    if dataset is None:
        return '', 404
    else:
        return jsonify(dataset), 200

@app.route('/fetch/<int:year>/<int:month>/<int:day>')
def fetch_data(year, month, day):
    # Authorized path
    api_key = request.headers.get('Api-Key', None)

    if api_key is None:
        return '', 400
    elif api_key != API_KEY:
        return '', 401
    else:
        date = datetime(day=day, month=month, year=year)
        fetch_dataset(date)
        return '', 201

if __name__ == "__main__":
    app.run(debug=True)
