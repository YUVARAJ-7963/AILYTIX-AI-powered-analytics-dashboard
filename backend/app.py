from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from config import Config
from models import db, User
import os


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    db.init_app(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, int(user_id))

    # Register blueprints (uncomment as you create them)
    from routes.auth import auth_bp
    from routes.ai import ai_bp
    from routes.charts import charts_bp
    # from routes.chat import chat_bp 
    # This is now handled by the AI blueprint
    from routes.files import files_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(ai_bp, url_prefix='/ai')
    app.register_blueprint(charts_bp, url_prefix='/charts')
    # app.register_blueprint(chat_bp, url_prefix='/chat')
    app.register_blueprint(files_bp, url_prefix='/files')

    @app.route('/')
    def home():
        return 'AILYTIX Flask backend is running!'

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True) 