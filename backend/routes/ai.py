from flask import Blueprint, jsonify, current_app, request
from flask_login import login_required, current_user
import pandas as pd
import os
from groq import Groq

from models import File, db

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/summary/<int:file_id>')
@login_required
def get_ai_summary(file_id):
    file = File.query.filter_by(id=file_id, user_id=current_user.id).first_or_404()
    
    api_key = current_app.config['GROQ_API_KEY']
    if not api_key:
        return jsonify({"error": "Groq API key is not configured."}), 500
        
    client = Groq(api_key=api_key)

    try:
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path, on_bad_lines='skip')
        else:
            df = pd.read_excel(file_path)
            
        data_preview = df.head(10).to_string()
        column_names = ", ".join(df.columns)

        prompt = (
            f"You are a world-class data analysis assistant. A user has uploaded a file named '{file.filename}' with the columns: {column_names}.\n\n"
            f"Here is a preview of the first 10 rows:\n{data_preview}\n\n"
            "Please provide your response in markdown format with the following structure:\n"
            "# [A clear headline/title for the dataset]\n"
            "## Summary\n"
            "A concise, insightful, one-paragraph summary of what this dataset is about, its potential use cases, and the type of analysis that could be performed.\n"
            "## Columns\n"
            "- A bullet list of the columns and what they represent (if possible)\n"
            "## Key Insights\n"
            "- Bullet points of any key insights you can infer from the preview.\n"
        )

        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful data analysis assistant that provides clear, concise summaries."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=250,
        )
        
        summary = response.choices[0].message.content.strip()
        
        return jsonify({"summary": summary})

    except FileNotFoundError:
        return jsonify({"error": "File not found on server."}), 404
    except Exception as e:
        current_app.logger.error(f"Groq API error: {str(e)}")
        return jsonify({"error": f"An error occurred with the AI service: {str(e)}"}), 500

@ai_bp.route('/chat', methods=['POST'])
@login_required
def ai_chat():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    file_id = data.get('file_id')
    messages = data.get('messages') 

    if not file_id or not messages:
        return jsonify({"error": "Missing file_id or messages"}), 400

    file = File.query.filter_by(id=file_id, user_id=current_user.id).first_or_404()

    api_key = current_app.config['GROQ_API_KEY']
    if not api_key:
        return jsonify({"error": "Groq API key is not configured."}), 500
        
    client = Groq(api_key=api_key)

    try:
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path, on_bad_lines='skip')
        else:
            df = pd.read_excel(file_path)

        data_head_str = df.head(10).to_string()

        system_prompt = (
            "You are a helpful and friendly data analysis assistant powered by LLaMA 3 and Groq. You are chatting with a user about a file they uploaded. "
            f"The file is named '{file.filename}' and it has these columns: {', '.join(df.columns)}. "
            f"Here is the head of the dataframe for context:\n{data_head_str}\n\n"
            "Keep your answers concise and directly related to the user's question about the data. If you don't know the answer from the data preview, say so."
        )

        conversation = [{"role": "system", "content": system_prompt}] + messages

        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=conversation,
            temperature=0.7,
            max_tokens=1024,
        )
        
        ai_response = response.choices[0].message.content.strip()

        return jsonify({"reply": ai_response})

    except Exception as e:
        current_app.logger.error(f"Groq API error: {str(e)}")
        return jsonify({"error": f"An error occurred with the AI service: {str(e)}"}), 500 