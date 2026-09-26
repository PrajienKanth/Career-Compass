import os
import logging

from flask import Flask
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect


# LOGGING

logging.basicConfig(
    level=logging.DEBUG
)


# DATABASE BASE

class Base(DeclarativeBase):
    pass


db = SQLAlchemy(
    model_class=Base
)


# FLASK APPLICATION

app = Flask(__name__)


# SECRET KEY

app.secret_key = os.environ.get(
    "SESSION_SECRET",
    "dev-secret-key-change-this"
)


# PROXY

app.wsgi_app = ProxyFix(
    app.wsgi_app,
    x_proto=1,
    x_host=1
)


# DATABASE CONFIGURATION

app.config[
    "SQLALCHEMY_DATABASE_URI"
] = os.environ.get(
    "DATABASE_URL",
    "sqlite:///career_compass.db"
)

app.config[
    "SQLALCHEMY_ENGINE_OPTIONS"
] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

app.config[
    "SQLALCHEMY_TRACK_MODIFICATIONS"
] = False


# FILE UPLOAD LIMIT

app.config[
    "MAX_CONTENT_LENGTH"
] = 5 * 1024 * 1024


# CSRF CONFIGURATION

app.config[
    "WTF_CSRF_ENABLED"
] = True

app.config[
    "WTF_CSRF_TIME_LIMIT"
] = 3600


# INITIALIZE DATABASE

db.init_app(app)


# INITIALIZE CSRF

csrf = CSRFProtect(app)


# LOGIN MANAGER

login_manager = LoginManager()

login_manager.init_app(app)

login_manager.login_view = "login"

login_manager.login_message = (
    "Please log in to access this page."
)

login_manager.login_message_category = "info"


# CREATE DATABASE TABLES

with app.app_context():

    import models

    db.create_all()


# IMPORT ROUTES

from routes import *


# APPLICATION START

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )