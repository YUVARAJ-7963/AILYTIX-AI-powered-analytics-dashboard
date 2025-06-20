from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import File
import pandas as pd
import os
from flask import current_app
import numpy as np

charts_bp = Blueprint('charts', __name__, url_prefix='/charts')

@charts_bp.route('/suggest/<int:file_id>', methods=['GET'])
@login_required
def suggest_charts(file_id):
    file = File.query.filter_by(id=file_id, user_id=current_user.id).first()
    if not file:
        return jsonify({'error': 'File not found'}), 404
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
    if file.filename.lower().endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file.filename.lower().endswith(('.xls', '.xlsx')):
        df = pd.read_excel(file_path)
    else:
        return jsonify({'error': 'Unsupported file type'}), 400
    numeric_cols = df.select_dtypes(include='number').columns.tolist()
    categorical_cols = df.select_dtypes(exclude='number').columns.tolist()
    suggestions = []
    # Line chart for first two numeric columns
    if len(numeric_cols) >= 2:
        suggestions.append({'type': 'line', 'x': numeric_cols[0], 'y': numeric_cols[1], 'title': f'Line: {numeric_cols[1]} vs {numeric_cols[0]}'})
        # Scatter plot
        suggestions.append({'type': 'scatter', 'x': numeric_cols[0], 'y': numeric_cols[1], 'title': f'Scatter: {numeric_cols[1]} vs {numeric_cols[0]}'})
        # Area chart
        suggestions.append({'type': 'area', 'x': numeric_cols[0], 'y': numeric_cols[1], 'title': f'Area: {numeric_cols[1]} vs {numeric_cols[0]}'})
    # Bar chart for first categorical and numeric
    if len(numeric_cols) >= 1 and len(categorical_cols) >= 1:
        suggestions.append({'type': 'bar', 'x': categorical_cols[0], 'y': numeric_cols[0], 'title': f'Bar: {numeric_cols[0]} by {categorical_cols[0]}'})
    # Pie/Doughnut chart for first categorical and numeric, limit to top 10 categories
    if len(categorical_cols) >= 1 and len(numeric_cols) >= 1:
        cat_col = categorical_cols[0]
        num_col = numeric_cols[0]
        top_cats = df.groupby(cat_col)[num_col].sum().sort_values(ascending=False).head(10)
        suggestions.append({'type': 'doughnut', 'labels': top_cats.index.tolist(), 'values': top_cats.values.tolist(), 'title': f'Top 10 {cat_col} by {num_col}'})
    # Histogram for each numeric column
    for col in numeric_cols:
        suggestions.append({'type': 'histogram', 'x': col, 'title': f'Histogram: {col}'})
    # Radar chart for up to 6 numeric columns
    if len(numeric_cols) >= 3 and len(numeric_cols) <= 6:
        radar_data = { 'type': 'radar', 'labels': numeric_cols, 'values': [df[c].mean() for c in numeric_cols], 'title': f'Radar: Means of {', '.join(numeric_cols)}' }
        suggestions.append(radar_data)
    # Bubble chart for 3 numeric columns
    if len(numeric_cols) >= 3:
        x, y, r = numeric_cols[:3]
        bubble_data = {
            'type': 'bubble',
            'x': x,
            'y': y,
            'r': r,
            'title': f'Bubble: {y} vs {x} (size: {r})'
        }
        suggestions.append(bubble_data)
    # Box plot for each numeric column
    for col in numeric_cols:
        suggestions.append({'type': 'box', 'x': col, 'title': f'Box Plot: {col}'})
    return jsonify({'suggestions': suggestions, 'columns': df.columns.tolist()})

@charts_bp.route('/data/<int:file_id>', methods=['GET'])
@login_required
def get_chart_data(file_id):
    file = File.query.filter_by(id=file_id, user_id=current_user.id).first()
    if not file:
        return jsonify({'error': 'File not found'}), 404
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
    if file.filename.lower().endswith('.csv'):
        df = pd.read_csv(file_path)
    elif file.filename.lower().endswith(('.xls', '.xlsx')):
        df = pd.read_excel(file_path)
    else:
        return jsonify({'error': 'Unsupported file type'}), 400
    df = df.replace({np.nan: None, np.inf: None, -np.inf: None})
    return df.to_dict(orient='list') 