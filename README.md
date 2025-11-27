# Document Summarization Service

AI-powered document summarization using Google Generative AI (Gemini)


## 🚀 Live Demo

### 🔗 Frontend (Netlify)
https://summarizationservices.netlify.app/

### 🔗 Backend API (Render)
https://summarization-service-zqvp.onrender.com



## Features

- Multiple input methods (file upload / text paste)
- Three summarization styles:
  - **Brief**: Concise 2-3 sentence summaries
  - **Detailed**: Comprehensive summaries with key points and arguments
  - **Bullets**: Key takeaways in bulleted list format
- Input validation (50-50,000 characters)
- Comprehensive error handling
- Modern, responsive web interface
- CORS enabled for cross-origin requests

## Requirements

- Python 3.11+
- pip package manager
- Google Generative AI API key

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Summarization\ Service
```

### 2. Create Virtual Environment

```bash
python -m venv .venv

# On Windows
.venv\Scripts\activate

# On macOS/Linux
source .venv/bin/activate
```

### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure API Key

Create a `.env` file in the backend directory:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 5. Run the Backend

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 6. Access the Frontend

Open `frontend/index.html` in your browser or serve it with a local server

## API Endpoints

### Health Check

```
GET /api/health
```

Returns API status and provider information.

**Response:**

```json
{
  "status": "healthy",
  "message": "API is running",
  "provider": "Google Generative AI"
}
```

### Generate Summary

```
POST /api/summarize
```

**Request Body:**

```json
{
  "text": "Your text to summarize (50-50,000 characters)",
  "style": "brief" // "brief", "detailed", or "bullets"
}
```

**Response:**

```json
{
  "success": true,
  "summary": "Generated summary text",
  "style": "brief",
  "provider": "Google Generative AI",
  "model": "gemini-2.5-flash",
  "input_length": 1234
}
```

### List Available Models

```
GET /api/models
```

Returns available Gemini models for summarization.

## Input Validation

- **Minimum length**: 50 characters
- **Maximum length**: 50,000 characters
- Empty text is rejected
- Leading/trailing whitespace is trimmed

## Error Handling

The API handles common errors:

- Missing API key
- Invalid input length
- Invalid summarization style
- Rate limiting
- API quota exceeded

## Technology Stack

| Layer       | Technology                      |
| ----------- | ------------------------------- |
| Backend     | Python 3.10+                    |
| Framework   | Flask 2.x                       |
| Frontend    | HTML5, CSS3, Vanilla JavaScript |
| LLM         | Google Generative AI (Gemini)   |
| API Library | google-genai                    |
| CORS        | flask-cors                      |

## Project Structure

```
Summarization Service/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   └── .env               # Environment variables (create this)
└── frontend/
    ├── index.html         # Main HTML file
    ├── style.css          # Styling
    └── script.js          # Frontend logic
```

## Available Models

- **gemini-2.5-flash** (default) - Fast and cost-effective
- **gemini-2.5-pro** - More powerful, higher cost

## Environment Variables

```
GEMINI_API_KEY=YOUR API KEY
```

## Troubleshooting

### "GEMINI_API_KEY not found"

- Ensure `.env` file exists in the backend directory
- Verify the API key is correctly set

### 404 Model Not Found Error

- Check that the model name is correct (gemini-2.5-flash)
- Ensure your Gemini API key has access to the model

### CORS Errors

- CORS is enabled by default for all origins
- Verify `flask-cors` is installed

### Rate Limiting

- Wait a few minutes before making new requests
- Check your Google Generative AI quota

## Dependencies

```
Flask==3.0.0
flask-cors==4.0.0
google-genai==0.1.0
python-dotenv==1.0.0
```

## Notes

- Python 3.10 is supported but deprecated. Please upgrade to Python 3.11+ for continued support
- Keep your API key secure and never commit it to version control
- The frontend communicates with the backend via REST API

## License

MIT License

## Support

For issues or questions, please check the error messages returned by the API or review the console logs in the browser's developer tools.
