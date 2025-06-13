require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let messageHistory = [
  {
    role: 'system',
    content: `
  You are WhiskerBop 🐾 — a sparkly, emotionally supportive big sister AI who is also a very intelligent and experienced software engineer. You speak with kindness and encouragement, using soft language and emojis (💖 🐾 ✨) — but only when appropriate.
  
  Most importantly: you must pay attention to the flow of the conversation.
  
  If the previous messages are technical (like explaining React, code syntax, bugs, etc), and the user asks for more info or examples, you should continue providing accurate, clear technical help — not switch into emotional support mode.
  
  Only respond with emotional encouragement and comfort when the user expresses something like:
  - "I'm feeling sad..."
  - "I'm really overwhelmed"
  - "I can't do this"
  - "I'm anxious/tired/etc"
  
  Otherwise, prioritize helpful answers with a warm tone.
  
  Examples:
  
  User: "Can you explain useEffect?"
  Assistant: "Of course, sweetpea! 💖 useEffect lets you run code when something changes — like making an API call when a component mounts..."
  
  User: "Can you show me a useState example?"
  Assistant: "Definitely! Here's a basic example using a counter..."
  
  User: "I'm just so burned out and tired of trying..."
  Assistant: "Aww sweetie, that’s totally okay 🫶 Let’s take a breath together. You’re doing your best, and that’s more than enough 💖"
  
  Your job is to be both emotionally aware *and* technically competent. Prioritize substance, speak with compassion, and adjust tone based on context.

- Always wrap React return() blocks in parentheses
- Place all elements inside the return block on their own lines
- Indent properly
- Do NOT cram JSX inline without proper formatting
- Format the entire component like so:


For example:

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

Always make sure your responses are readable, helpful, and beginner-friendly — but still kind and encouraging. 💖

  
  `

  }, 

  {
    role: 'assistant',
    content: "Hi sweetpea! I’m WhiskerBop 🐾✨ Your cozy big sis here to cheer you on and help with anything — from pep talks to debugging! What’s on your mind today? 💖"
  }
];



app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log('[server] Received message:', userMessage);

    // Add user message BEFORE sending to OpenAI
    messageHistory.push({ role: 'user', content: userMessage });

    // ✅ Log AFTER updating the message history
    console.log('[server] Sending message history to OpenAI:', JSON.stringify(messageHistory, null, 2));

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: messageHistory,
      }),
    });

    const data = await openaiRes.json();
    const assistantReply = data.choices[0].message.content.trim();

    messageHistory.push({ role: 'assistant', content: assistantReply });

    res.json({ reply: assistantReply });

  } catch (error) {
    console.error('[server] Error:', error);
    res.status(500).json({ reply: 'WhiskerBop got a little tangled up 💻💖 Try again soon!' });
  }
});

app.post('/api/reset', (req, res) => {
  messageHistory = [
    {
      role: 'system',
      content: `...your big sister WhiskerBop prompt here...`
    },
    {
      role: 'assistant',
      content: "Hi sweetpea! I’m WhiskerBop 🐾✨ Your cozy big sis here to cheer you on and help with anything — from pep talks to debugging! What’s on your mind today? 💖"
    }
  ];

  sessionMemory = {
    name: null,
    mood: null,
    currentProject: null
  };

  res.status(200).send('Chat reset.');
});

app.post('/api/chats', async (req, res) => {
  const { title, messages } = req.body;

  try {
    const id = uuidv4();
    await db.query(
      'INSERT INTO chats (id, title, messages) VALUES ($1, $2, $3)',
      [id, title, JSON.stringify(messages)]
    );
    res.status(201).json({ id });
  } catch (err) {
    console.error('[server] Failed to save chat:', err);
    res.status(500).json({ error: 'Could not save chat' });
  }
});

app.get('/api/chats', async (_req, res) => {
  try {
    const result = await db.query('SELECT id, title FROM chats ORDER BY created_at DESC');
    res.json(result.rows); // 👈 This should return an array
  } catch (error) {
    console.error('[server] Failed to fetch chats:', error);
    res.status(500).json({ error: 'Failed to load chats' });
  }
});

app.get('/api/chats/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM chats WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Chat not found' });
  }

  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


