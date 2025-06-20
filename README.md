# AIlytix

A full-stack AI-powered analytics platform with data visualization capabilities.

## Features

- **AI-Powered Insights**: Get intelligent analysis of your data
- **Interactive Charts**: Multiple chart types including line, bar, area, scatter, and more
- **File Upload & Processing**: Upload and analyze various file formats
- **User Authentication**: Secure login and registration system
- **Real-time Dashboard**: Beautiful and responsive dashboard interface

## Tech Stack

### Backend
- **Python Flask**: Web framework
- **SQLAlchemy**: Database ORM
- **SQLite**: Database
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Chart.js**: Data visualization
- **Vite**: Build tool

## Project Structure

```
AIlytix/
├── backend/                 # Flask backend
│   ├── app.py              # Main application file
│   ├── config.py           # Configuration
│   ├── models.py           # Database models
│   ├── requirements.txt    # Python dependencies
│   └── routes/             # API routes
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── charts/         # Chart components
│   ├── package.json        # Node.js dependencies
│   └── vite.config.ts      # Vite configuration
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Initialize the database:
   ```bash
   python create_db.py
   ```

6. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Register a new account or login
3. Upload your data files
4. View AI-generated insights and interactive charts
5. Explore the dashboard for comprehensive analytics

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/files/upload` - File upload
- `GET /api/charts/data` - Get chart data
- `POST /api/ai/analyze` - AI analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub. 