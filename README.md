# ☁️ CloudReady AI — AZ-900 Study Buddy

> **AI Study Buddy Hackathon Entry**
>
> _Cloud concepts can feel abstract, especially for beginners. CloudReady AI is an intelligent assistant that explains Azure Fundamentals in simple terms, with real-life African examples and Kiswahili language support._

![CloudReady AI](https://img.shields.io/badge/Azure_Fundamentals-AZ--900-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Powered_by-Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

---

## 🎯 Challenge Statement

**Problem:** Cloud computing concepts can feel abstract, especially for beginners in Africa who may lack exposure to enterprise infrastructure.

**Solution:** CloudReady AI is an AI-powered study buddy that makes Azure Fundamentals (AZ-900) concepts accessible through:

- **Simple, beginner-friendly explanations** — no jargon overload
- **Real-life Kenyan & African analogies** — M-Pesa for distributed systems, matatu fleets for scalability, solar/generator backups for availability zones
- **Kiswahili language support** — ask in Kiswahili, learn in Kiswahili
- **Interactive quizzes** — test and reinforce your knowledge
- **Graceful offline fallback** — curated lessons work even without an internet connection or API key

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Tutor** | Gemini AI generates contextual, AZ-900-accurate explanations |
| 🇰🇪 **African Context** | Every concept anchored with relatable Kenyan/African examples |
| 🌍 **Kiswahili Support** | Full Kiswahili explanations with technical terms preserved |
| 📚 **Curated Fallback** | 7 hand-crafted lessons with Microsoft Learn sources for offline mode |
| 📝 **Interactive Quiz** | 5 AZ-900 practice questions with server-side grading and explanations |
| 🛡️ **Honest AI** | Clear badges showing "⚡ Live AI" vs "📚 Curated Lesson" mode |
| 🔒 **Secure Backend** | API key stays server-side; no secrets ever reach the browser |
| 📖 **Markdown Rendering** | Rich AI responses with headings, lists, code blocks, and blockquotes |
| 🧹 **Content Normalization** | Auto-corrects flag emoji errors and HTML entity artifacts from the model |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                      │
│  React + TypeScript + Vite                      │
│  ┌─────────────┐  ┌──────────────┐              │
│  │  AI Tutor   │  │   AZ-900     │              │
│  │  Chat UI    │  │   Quiz UI    │              │
│  └──────┬──────┘  └──────┬───────┘              │
│         │                │                      │
└─────────┼────────────────┼──────────────────────┘
          │  POST /api/ask │  GET /api/quiz
          │                │  POST /api/quiz/submit
┌─────────┼────────────────┼──────────────────────┐
│         ▼                ▼                      │
│              Backend (Express + TS)             │
│  ┌──────────────────────────────────────┐       │
│  │  Gemini AI Module (ai.ts)            │       │
│  │  • System prompt engineering         │       │
│  │  • Model fallback chain              │       │
│  │  • Timeout + abort handling          │       │
│  └──────────────┬───────────────────────┘       │
│                 │                               │
│  ┌──────────────▼───────────────────────┐       │
│  │  Curated Lessons Fallback            │       │
│  │  • 7 AZ-900 topics                  │       │
│  │  • Keyword matching                  │       │
│  │  • Microsoft Learn sources           │       │
│  └──────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
          │
          ▼
   Google Gemini API
   (gemini-3.5-flash)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 8, react-markdown |
| **Backend** | Node.js, Express 5, TypeScript, tsx |
| **AI Model** | Google Gemini (`@google/genai` SDK) |
| **Styling** | Vanilla CSS with responsive design |
| **Build** | Vite (frontend), tsc (backend) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Google Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com)

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/cloudready-ai.git
cd cloudready-ai

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Configure Environment

```bash
# In the server/ directory
cp .env.example .env
```

Edit `server/.env` and add your real API key:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-3.5-flash
```

### 3. Run Locally

Open two terminal windows:

```bash
# Terminal 1 — Backend (port 3000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd cloudready-ai
npm run dev
```

Visit **http://localhost:5173** to start learning!

> **Note:** If no API key is configured, the app automatically falls back to curated lessons — it always works.

---

## 🧠 Prompt Engineering

CloudReady AI uses a carefully crafted **system prompt** to maximize learning value. Key design decisions:

### System Prompt Highlights

1. **Persona:** Patient, encouraging AZ-900 Study Buddy for African beginners
2. **Language:** Defaults to clear English; switches to fluent Kiswahili when the learner asks in Kiswahili
3. **African Analogies:** M-Pesa agent networks → distributed availability; local duka vs. supermarket → on-premises vs. cloud; matatu fleets → auto-scaling compute
4. **Factual Grounding:** Never invents Azure services, regions, or SLAs; never provides exam dumps
5. **Misconception Correction:** Gently corrects misunderstandings using the Shared Responsibility Model
6. **Out-of-Scope Redirect:** Politely redirects non-cloud questions back to AZ-900 topics
7. **Service Model Precision:** Carefully distinguishes IaaS/PaaS/SaaS responsibilities — avoids oversimplifying PaaS as "customer manages nothing"
8. **Markdown Output:** Structured responses with bold key terms, headers, bullet lists, and comprehension checks

### Model Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `temperature` | 0.3 | Low creativity for factual accuracy |
| `maxOutputTokens` | 2048 | Long enough for detailed explanations |
| `timeout` | 30s | Graceful degradation to curated fallback |
| Model fallback | `gemini-3.5-flash` ↔ `gemini-3.5-flash-lite` | Auto-falls back on 404/503 |

### Content Normalization Pipeline

A frontend normalizer ([`markdownNormalizer.ts`](src/utils/markdownNormalizer.ts)) post-processes AI output:
- Corrects wrong flag emoji (🇰🇬 Kyrgyzstan → 🇰🇪 Kenya)
- Decodes numeric HTML entities while blocking XSS
- Fixes broken markdown bold spacing
- Preserves code blocks from mutation

---

## 📊 Judging Criteria Alignment

| Criterion | Weight | How CloudReady AI Addresses It |
|-----------|--------|-------------------------------|
| **Learning Value** | 25% | Structured AZ-900 explanations, comprehension checks, interactive quiz with server-side grading, Kiswahili support for language accessibility |
| **Prompt Engineering** | 20% | Detailed system prompt with African context rules, flag accuracy, service model precision, misconception correction, content normalization pipeline |
| **UX & Vibes** | 15% | Clean modern UI, suggested questions, AI/curated mode badges, responsive design, loading states, smooth quiz flow |
| **Rapid Prototyping** | 15% | Full-stack TypeScript, Vite hot reload, tsx watch for backend, graceful fallback architecture |
| **Technical Creativity** | 15% | Dual-mode AI + curated fallback, markdown normalization, model fallback chain, abort-controller timeout handling |
| **Presentation & Docs** | 10% | Comprehensive README, architecture diagram, `.env.example`, clear setup instructions |

---

## 📁 Project Structure

```
cloudready-ai/
├── index.html                  # Entry HTML with SEO metadata
├── package.json                # Frontend dependencies
├── vite.config.ts              # Vite configuration
├── public/
│   ├── favicon.svg             # Custom CloudReady favicon
│   └── icons.svg               # UI icons
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Styles (responsive, quiz, markdown)
│   ├── index.css               # Global resets
│   └── utils/
│       └── markdownNormalizer.ts  # AI output content normalizer
└── server/
    ├── package.json            # Backend dependencies
    ├── .env.example            # Environment template (safe)
    ├── tsconfig.json           # TypeScript config
    └── src/
        ├── index.ts            # Express server, routes, curated lessons
        └── ai.ts               # Gemini AI integration & system prompt
```

---

## ⚖️ Disclaimer

CloudReady AI is an independent educational project. It is **not affiliated with or endorsed by Microsoft**. All Azure concepts are sourced from official Microsoft Learn documentation. Always verify information against [Microsoft Learn](https://learn.microsoft.com) for the most current and accurate details.

---

<p align="center"><em>Learn today. Build tomorrow. 🇰🇪</em></p>
