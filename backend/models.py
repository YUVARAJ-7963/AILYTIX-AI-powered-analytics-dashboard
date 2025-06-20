from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

# SQLAlchemy instance will be initialized in app.py

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(512))  # hashed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    files = db.relationship('File', backref='owner', lazy=True)
    chats = db.relationship('Chat', backref='user', lazy=True)

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(256), nullable=False)
    upload_time = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    file_metadata = db.Column(db.JSON)
    chats = db.relationship('Chat', backref='file', lazy=True)

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_id = db.Column(db.Integer, db.ForeignKey('file.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow) 