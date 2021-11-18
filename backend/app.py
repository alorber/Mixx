from flask import Flask, redirect, url_for
from pymongo import MongoClient
import json

app = Flask(__name__)

mongoClient = MongoClient('mongodb://127.0.0.1:27017')

if __name__ == "__main__":
    app.run(debug=True)