# 🐾 WhiskerBop ChatBox 💖

Welcome to **WhiskerBop** — your cozy, kindhearted, big-sis-style AI chatbox! Built with love, Vanilla JS, Node.js, and OpenAI’s GPT API, WhiskerBop is both *smart* and *sweet* — ready to answer your toughest coding questions or brighten your day with some gentle support. 🌈🐱

## ✨ Features

- 💬 Real-time chat interface with WhiskerBop, the emotionally intelligent AI
- 🧠 Handles both technical questions (e.g., JavaScript, web dev, software engineering) and emotional support
- 📁 Save and revisit chat logs in the sidebar
- ✍️ Name your chats for easy reference
- 🌸 Cute, positive UI with a warm tone and cheerful aesthetic

## 🛠 Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js + Express
- **AI**: OpenAI GPT-4.1-Nano
- **Database**: PostgreSQL for chat log storage
- **Other Tools**:
  - `dotenv` for environment variable management
  - `pg` for PostgreSQL client integration

## 🚀 Getting Started

### 1. Clone the repo

```
git clone git@github.com:nvnatasha/ChatBox.git
cd ChatBox
```

### 2. Install dependencies
```
npm install
```

### 3. Create your .env file
```
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/whiskerbop
```

### 4. Start the server
```
node server.js
```

### 5. Open your app
Visit http://localhost:3000 in your browser and start chatting with WhiskerBop! 🐾

### 💾 Database Schema
```
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  messages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```


### 🐱 Future Enhancements
User authentication

Export/share chats

Dark/light mode toggle

More personality modes for WhiskerBop (coding, cozy, cat-speak, etc.)


### 💖 Made With Love By
Natasha Vasquez
github.com/nvnatasha
Whisker-approved developer 🐾

“Remember sweetpea, you’re doing amazing and I’m so proud of you!” – WhiskerBop 💖✨
