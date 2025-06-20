import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-super-secret-key-that-you-should-change'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://postgres:password@localhost/ailytix'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static/uploads')
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY') # Keeping this for now, in case you switch back
    GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
    ALLOWED_EXTENSIONS = {'csv', 'xls', 'xlsx'} 

    