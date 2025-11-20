# Design Approach & Technical Decisions

## Document Summarization Service

**Project**: AI-Powered Document Summarization Tool  
**Technology**: Flask + Google Gemini API  
**Author**: Priyanka
**Date**: November 2025

---

## 📊 Executive Summary

This document outlines the technical approach, design decisions, and architectural choices made during the development of a document summarization service. The system leverages Google's Gemini 2.5 Flash model to provide three distinct summarization styles through a clean, user-friendly web interface.

---

## 🎯 Project Objectives

### Primary Goals

1. Create an intuitive document summarization tool
2. Support multiple input methods (file upload, direct text)
3. Offer different summarization styles for various use cases
4. Ensure robust error handling and validation
5. Maintain cost-effectiveness (free tier usage)
6. Deliver fast response times (<5 seconds)

### Success Criteria

- ✅ 99% uptime for API calls
- ✅ <3 second average response time
- ✅ Support documents up to 50,000 characters
- ✅ Handle 15+ requests per minute
- ✅ Zero API key exposure to frontend
- ✅ Mobile-responsive interface

---

## 🏛️ Architectural Approach

### 1. System Architecture Selection

**Chosen Architecture**: Client-Server with REST API

```
┌─────────────┐         HTTP/JSON          ┌─────────────┐
│             │    ←─────────────────→     │             │
│   Frontend  │                            │   Backend   │
│  (Browser)  │                            │   (Flask)   │
│             │                            │             │
└─────────────┘                            └──────┬──────┘
                                                   │
                                                   │ API
                                                   │
                                            ┌──────▼──────┐
                                            │   Gemini    │
                                            │     API     │
                                            └─────────────┘
```

**Why this architecture?**

| Consideration              | Decision    | Rationale                                         |
| -------------------------- | ----------- | ------------------------------------------------- |
| **Separation of Concerns** | ✅ Yes      | Frontend focuses on UX, backend on business logic |
| **Security**               | ✅ Enhanced | API keys never exposed to client                  |
| **Scalability**            | ✅ High     | Easy to add load balancing, caching               |
| **Maintainability**        | ✅ Good     | Clear boundaries between layers                   |
| **Deployment**             | ✅ Flexible | Frontend and backend can deploy separately        |

**Alternative Considered**: Serverless (AWS Lambda)

- ❌ Rejected due to cold start latency
- ❌ More complex setup for assignment purposes
- ❌ Harder to debug locally

---

## 🧠 LLM Provider Selection

### Decision: Google Gemini 2.5 Flash

**Key Reasons for Gemini:**

1. **Cost Efficiency**

   - Completely free with generous limits
   - No credit card required
   - 1M tokens per minute (more than sufficient)

2. **Performance**

   - Response time: 1-2 seconds average
   - Gemini 2.5 Flash optimized for speed
   - Handles concurrent requests well

3. **Reliability**

   - Google's infrastructure (99.9% uptime)
   - Global CDN for low latency
   - Automatic failover

4. **Developer Experience**
   - Simple API key generation
   - Excellent documentation
   - Official Python SDK
   - Active community support

---

## 🔧 Technology Stack Decisions

### Backend: Flask (Python)

**Why Flask over alternatives?**

| Framework  | Pros                          | Cons                     | Decision      |
| ---------- | ----------------------------- | ------------------------ | ------------- |
| **Flask**  | Lightweight, simple, flexible | Fewer built-in features  | ✅ **CHOSEN** |
| Django     | Full-featured, admin panel    | Heavy, overkill for this | ❌            |
| FastAPI    | Modern, async, auto-docs      | Steeper learning curve   | ❌            |
| Express.js | JavaScript everywhere         | Different language stack | ❌            |

**Flask Advantages:**

- ✅ Minimal boilerplate (20 lines to start)
- ✅ Easy to understand for assignments
- ✅ Extensive documentation
- ✅ Perfect for RESTful APIs
- ✅ Great ecosystem (Flask-CORS, etc.)

### Frontend: Vanilla JavaScript

**Why no framework?**

| Approach       | Pros                          | Cons                    | Decision      |
| -------------- | ----------------------------- | ----------------------- | ------------- |
| **Vanilla JS** | No dependencies, fast, simple | More manual DOM work    | ✅ **CHOSEN** |
| React          | Component model, ecosystem    | Build setup, complexity | ❌            |
| Vue            | Easy to learn, reactive       | Still requires bundler  | ❌            |
| jQuery         | Simplifies DOM                | Outdated, unnecessary   | ❌            |

**Vanilla JS Advantages:**

- ✅ Zero build process
- ✅ Instant load time (no framework overhead)
- ✅ Easy to deploy (single HTML file)
- ✅ Better for learning core concepts
- ✅ No version compatibility issues

---

## 🎨 User Interface Design Philosophy

### Design Principles

**1. Progressive Disclosure**

```
User Flow:
┌─────────────┐
│ Empty State │ → Clear call-to-action
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Input State │ → Real-time validation feedback
└──────┬──────┘
       │
       ▼
┌──────────────┐
│ Loading State│ → Visual progress indicator
└──────┬───────┘
       │
       ▼
┌───────────────┐
│ Result State  │ → Summary + actions (copy, download)
└───────────────┘
```

**2. Visual Hierarchy**

```
Priority 1: Primary Action (Generate Summary)
   ▲
   │ Large, high contrast, center-aligned
   │
Priority 2: Input Methods (Text/File)
   ▲
   │ Prominent, easy to find
   │
Priority 3: Style Selection
   ▲
   │ Clear but not dominant
   │
Priority 4: Metadata (char count, stats)
   │
   │ Subtle, non-intrusive
   ▼
```

**3. Color Psychology**

| Color                | Usage                    | Psychological Effect    |
| -------------------- | ------------------------ | ----------------------- |
| **Green (#10a37f)**  | Success, primary actions | Trust, growth, positive |
| **Red (#ef4444)**    | Errors, warnings         | Urgency, attention      |
| **Purple (#6e40c9)** | Secondary actions        | Creativity, wisdom      |
| **Gray (#6b7280)**   | Neutral info             | Balanced, professional  |

**4. Accessibility Considerations**

- ✅ High contrast ratios (WCAG AA compliant)
- ✅ Keyboard navigation support
- ✅ Clear focus indicators
- ✅ Screen reader friendly labels
- ✅ Error messages with context

---

## 🛡️ Input Validation Strategy

### Multi-Layer Defense

**Layer 1: Frontend Validation (UX)**

```javascript
Purpose: Immediate user feedback
Benefits:
- Instant response (no server roundtrip)
- Better user experience
- Reduced server load
Checks:
- Text length (50-50,000 chars)
- File type (.txt, .md, .json)
- File size (<5MB)
- Empty input detection
```

**Layer 2: Backend Validation (Security)**

```python
Purpose: Security and data integrity
Benefits:
- Cannot be bypassed
- Server-side enforcement
- Protects API from abuse
Checks:
- Re-validate all frontend rules
- Sanitize special characters
- Check for injection attempts
- Verify API key format
```

**Why Both Layers?**

```
Scenario 1: Normal User
├─ Frontend catches error ✅
└─ Fast feedback, good UX

Scenario 2: Malicious User (bypasses frontend)
├─ Frontend bypassed
├─ Backend catches error ✅
└─ System protected

Scenario 3: API Direct Call
├─ No frontend
├─ Backend validates ✅
└─ System remains secure
```

---

## 🎯 Summarization Style Implementation

### Prompt Engineering Approach

**Strategy**: Dual-Prompt System

```python
def get_style_prompt(style, text):
    # Part 1: Role Definition (System Prompt)
    system = "You are a skilled summarizer..."

    # Part 2: Task Specification (User Prompt)
    user = f"Summarize this text as [style]:\n\n{text}"

    return system, user
```

**Why this approach?**

1. **Consistency**: Same structure across all styles
2. **Clarity**: Clear separation of role vs task
3. **Flexibility**: Easy to modify individual styles
4. **Quality**: Better results than single-prompt

### Style Definitions

**Brief Style**

```
Goal: Quick overview for busy readers
Target Length: 2-3 sentences (50-75 words)
Use Case: Email summaries, quick scans
Approach: Extract only core message
```

**Detailed Style**

```
Goal: Comprehensive understanding
Target Length: Multiple paragraphs (150-300 words)
Use Case: Research, thorough analysis
Approach: Include context, nuance, supporting details
```

**Bullets Style**

```
Goal: Scannable key points
Target Format: 3-7 bullet points
Use Case: Meeting notes, action items
Approach: Extract discrete, actionable insights
```

---

### Frontend Optimizations

**1. Debouncing Text Input**

```javascript
// Prevents excessive character counting
let timeout;
textInput.addEventListener("input", () => {
  clearTimeout(timeout);
  timeout = setTimeout(updateCount, 300); // Wait 300ms
});
```

**2. CSS Transitions > JavaScript Animations**

```css
/* Hardware accelerated, smooth */
.button {
  transition: transform 0.3s ease;
}
.button:hover {
  transform: translateY(-2px);
}
```

**3. Minimal DOM Manipulation**

```javascript
// ❌ Bad: Multiple DOM updates
element.style.color = "red";
element.style.fontSize = "16px";
element.style.padding = "10px";

// ✅ Good: Single class toggle
element.classList.add("error-state");
```

---

## 🔒 Security Considerations

### 1. API Key Protection

**Problem**: API keys must never be exposed

**Solution Layers**:

```
Layer 1: Environment Variables
├─ Store in .env file
└─ Load with python-dotenv

Layer 2: .gitignore
├─ Prevent committing .env
└─ Use .env.example template

Layer 3: Server-Side Only
├─ Backend makes API calls
└─ Frontend never sees key

Layer 4: Key Masking in Logs
├─ Show: AIzaSyBa...xyz
└─ Hide: AIzaSyBa12345678901234567890
```

### 2. Input Sanitization

**Threats Mitigated**:

| Threat      | Protection | How                       |
| ----------- | ---------- | ------------------------- |
| XSS         | ✅         | Escape HTML in responses  |
| Injection   | ✅         | Validate input types      |
| DoS         | ✅         | Length limits (50K chars) |
| File Upload | ✅         | Whitelist extensions      |
| Large Files | ✅         | 5MB size limit            |

### 3. CORS Configuration

**Development**:

```python
CORS(app)  # Allow all origins
```

---

## 🧪 Testing Strategy

### Test Pyramid

```
        ┌────────┐
        │  E2E   │  ← 10% (Full user flows)
        └────────┘
      ┌────────────┐
      │ Integration│  ← 30% (API + Frontend)
      └────────────┘
    ┌──────────────────┐
    │      Unit        │  ← 60% (Individual functions)
    └──────────────────┘
```

### Test Categories

**1. Unit Tests (Backend)**

```python
def test_validate_input_empty():
    valid, error = validate_input("")
    assert not valid
    assert error == "Text cannot be empty"

def test_validate_input_too_short():
    valid, error = validate_input("Hi")
    assert not valid
    assert "too short" in error.lower()
```

**2. Integration Tests**

```python
def test_api_health_endpoint():
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'

def test_summarize_brief_style():
    data = {'text': long_text, 'style': 'brief'}
    response = client.post('/api/summarize', json=data)
    assert response.status_code == 200
    assert len(response.json['summary']) < 500
```

**3. End-to-End Tests**

```javascript
// Playwright/Selenium test
test("Complete summarization flow", async () => {
  await page.goto("http://localhost:8000");
  await page.fill("#textInput", sampleText);
  await page.click("#summarizeBtn");
  await page.waitForSelector("#successState");
  const summary = await page.textContent("#summaryOutput");
  expect(summary.length).toBeGreaterThan(0);
});
```

---

## 📊 Error Handling Philosophy

### Error Categories & Responses

**1. User Errors (400 series)**

```
Characteristic: User can fix
Response: Clear, actionable message
Example: "Text too short (minimum 50 characters)"
```

**2. Server Errors (500 series)**

```
Characteristic: System issue
Response: Apologetic, with retry suggestion
Example: "Unable to process request. Please try again."
```

**3. API Errors (External)**

```
Characteristic: Third-party issue
Response: Transparent, with alternative
Example: "API temporarily unavailable. Try again in 60 seconds."
```

### Error Message Best Practices

**❌ Bad Error Messages**:

- "Error 500"
- "null reference exception"
- "Something went wrong"

**✅ Good Error Messages**:

- "Cannot connect to summarization service. Please check your internet connection."
- "This file type is not supported. Please upload .txt, .md, or .json files."
- "Your text is 25 characters long. Please provide at least 50 characters for meaningful summarization."

**Formula**: `[What happened] + [Why] + [How to fix]`

---

## 🚀 Deployment Considerations

### Development vs Production

| Aspect         | Development           | Production        |
| -------------- | --------------------- | ----------------- |
| **Debug Mode** | ON (Flask debug=True) | OFF (debug=False) |
| **CORS**       | All origins           | Specific domains  |
| **Logging**    | Verbose               | Error level only  |
| **API Keys**   | .env file             | Secrets manager   |
| **Server**     | Flask dev server      | Gunicorn/uWSGI    |
| **HTTPS**      | Optional              | Required          |

### Recommended Production Setup

```
Architecture:
┌─────────────┐
│   Nginx     │  ← Reverse proxy, SSL termination
└──────┬──────┘
       │
┌──────▼──────┐
│  Gunicorn   │  ← WSGI server (4 workers)
└──────┬──────┘
       │
┌──────▼──────┐
│ Flask App   │  ← Your application
└─────────────┘
```

---
