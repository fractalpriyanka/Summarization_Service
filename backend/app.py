from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configure Gemini API with your API key
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Initialize the model
model = genai.GenerativeModel('gemini-2.5-flash')

def validate_input(text):
    """Validate input text"""
    if not text or len(text.strip()) == 0:
        return False, "Text cannot be empty"
    if len(text.strip()) < 50:
        return False, "Text too short (minimum 50 characters)"
    if len(text) > 50000:
        return False, "Text too long (maximum 50,000 characters)"
    return True, None

def get_style_prompt(style, text):
    """Generate prompts based on summarization style"""
    prompts = {
        'brief': f"You are a skilled summarizer. Create a brief, concise summary in 2-3 sentences that captures the main ideas.\n\nSummarize the following text:\n\n{text}",
        'detailed': f"You are a skilled summarizer. Create a detailed, comprehensive summary that includes key points, important details, and main arguments in well-organized paragraphs.\n\nSummarize the following text:\n\n{text}",
        'bullets': f"You are a skilled summarizer. Create a bulleted summary that extracts the main points and key takeaways in a clear, organized list format.\n\nSummarize the following text as bullet points:\n\n{text}"
    }
    return prompts.get(style, prompts['brief'])

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'API is running',
        'provider': 'Google Gemini'
    })

@app.route('/api/summarize', methods=['POST'])
def summarize():
    """Main summarization endpoint"""
    try:
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        text = data.get('text', '')
        style = data.get('style', 'brief')
        
        # Validate input
        is_valid, error_message = validate_input(text)
        if not is_valid:
            return jsonify({'error': error_message}), 400
        
        # Validate style
        if style not in ['brief', 'detailed', 'bullets']:
            return jsonify({'error': 'Invalid style. Use: brief, detailed, or bullets'}), 400
        
        # Get prompt based on style
        prompt = get_style_prompt(style, text)
        
        # Call Gemini API
        response = model.generate_content(prompt)
        
        # Extract summary from response
        summary = response.text.strip()
        
        return jsonify({
            'success': True,
            'summary': summary,
            'style': style,
            'provider': 'Google Gemini',
            'model': 'gemini-2.5-flash',
            'input_length': len(text)
        })
    
    except Exception as e:
        error_message = str(e)
        
        # Handle specific Gemini API errors
        if 'api_key' in error_message.lower() or 'API_KEY_INVALID' in error_message:
            error_message = 'Invalid API key. Please check your GEMINI_API_KEY in .env file.'
        elif 'rate_limit' in error_message.lower() or 'RATE_LIMIT' in error_message:
            error_message = 'Rate limit exceeded. Please try again in a few moments.'
        elif 'quota' in error_message.lower() or 'QUOTA' in error_message:
            error_message = 'API quota exceeded. Please check your Gemini API usage.'
        
        return jsonify({'error': error_message}), 500

@app.route('/api/models', methods=['GET'])
def list_models():
    """List available Gemini models"""
    return jsonify({
        'models': [
            {
                'name': 'gemini-2.5-flash',
                'description': 'Fast and cost-effective',
                'current': True
            },
            {
                'name': 'gemini-2.5-flash',
                'description': 'More powerful, higher cost',
                'current': False
            }
        ]
    })

if __name__ == '__main__':
    # Check if API key is set
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ ERROR: GEMINI_API_KEY not found in .env file")
        print("Please add your GEMINI API key to the .env file")
        print("\nSteps:")
        print("1. Go to https://aistudio.google.com/app/apikey")
        print("2. Create an API key")
        print("3. Add to .env file: GEMINI_API_KEY=your_key_here")
        exit(1)
    
    if api_key == 'your_gemini_api_key_here':
        print("❌ ERROR: Please replace 'your_gemini_api_key_here' with your actual API key")
        exit(1)
    
    print("="*50)
    print("🚀 Document Summarization Service")
    print("="*50)
    print(f"✅ Server starting on http://localhost:5000")
    print(f"✅ Using Google Gemini API (gemini-2.5-flash)")
    print(f"✅ API Key configured: {api_key[:8]}...{api_key[-4:]}")
    print("="*50)
    
    app.run(debug=True, port=5000)
    
    # python -m http.server 8000
    # python backend/app.py