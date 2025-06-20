from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from models import db, File
import os
import pandas as pd

files_bp = Blueprint('files', __name__, url_prefix='/files')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@files_bp.route('/upload', methods=['POST'])
@login_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        counter = 1
        # Find a unique filename
        while os.path.exists(save_path):
            filename = f"{name} ({counter}){ext}"
            save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            counter += 1
        file.save(save_path)
        # Extract metadata
        if filename.lower().endswith('.csv'):
            df = pd.read_csv(save_path)
        elif filename.lower().endswith(('.xls', '.xlsx')):
            df = pd.read_excel(save_path)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400
        metadata = {
            'columns': list(df.columns),
            'dtypes': df.dtypes.astype(str).to_dict(),
            'num_rows': len(df)
        }
        file_record = File(filename=filename, user_id=current_user.id, file_metadata=metadata)
        db.session.add(file_record)
        db.session.commit()
        return jsonify({'message': 'File uploaded', 'file_id': file_record.id, 'file_metadata': metadata})
    return jsonify({'error': 'Invalid file type'}), 400

@files_bp.route('/list', methods=['GET'])
@login_required
def list_files():
    files = File.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'id': f.id,
            'filename': f.filename,
            'upload_time': f.upload_time,
            'file_metadata': f.file_metadata
        } for f in files
    ])

@files_bp.route('/delete/<int:file_id>', methods=['DELETE'])
@login_required
def delete_file(file_id):
    file = File.query.filter_by(id=file_id, user_id=current_user.id).first()
    if not file:
        return jsonify({'error': 'File not found'}), 404
    # Delete the file from disk
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception as e:
            return jsonify({'error': f'Failed to delete file from disk: {str(e)}'}), 500
    # Delete from database
    db.session.delete(file)
    db.session.commit()
    return jsonify({'message': 'File deleted successfully'}) 