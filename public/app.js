const API_KEY = 'OPENAI_API_KEY'; // replace with your real API key

const chatBox = document.getElementById('chat-box');
const form = document.getElementById('chat-form');
const input = document.getElementById('input');

window.addEventListener('DOMContentLoaded', () => {
    appendMessage('assistant', "Hi sweetpea! I’m WhiskerBop 🐾✨ Your cozy big sis here to sprinkle kindness and cheer! What’s on your heart today? 💖");
});
window.addEventListener('DOMContentLoaded', fetchSavedChats);

document.addEventListener('DOMContentLoaded', () => {
  fetchSavedChats(); // 👈 must be called on load!
});


document.getElementById('new-chat').addEventListener('click', async () => {
    await fetch('/api/reset', { method: 'POST' });

    chatBox.innerHTML = '';
    appendMessage('assistant', "Hi sweetpea! I’m WhiskerBop 🐾✨ Your cozy big sis here to cheer you on and help with anything — from pep talks to debugging! What’s on your mind today? 💖");
});

document.getElementById('save-chat').addEventListener('click', async (e) => {
  e.preventDefault();

  const chatTitle = prompt("Give this chat a title (or leave blank):");
  const messages = [];

  // Get all messages from the chat box
  document.querySelectorAll('#chat-box div').forEach((msgDiv) => {
    const role = msgDiv.classList.contains('user') ? 'user' : 'assistant';
    messages.push({ role, content: msgDiv.textContent });
  });

  // Send to backend
  try {
    const res = await fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: chatTitle,
        messages: messages,
      }),
    });

    if (res.ok) {
      alert('Chat saved! 💾✨');
      fetchSavedChats(); // 🐾 Refresh sidebar
    } else {
      throw new Error('Server error saving chat');
    }
  } catch (error) {
    console.error('Failed to save chat:', error);
    alert('Oops! Something went wrong saving the chat 😿');
  }
});

    

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = input.value;
    appendMessage('user', userMessage);
    input.value = '';

    const response = await getGPTResponse(userMessage);
    appendMessage('assistant', response);
});

function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
  
    // Create label
    const label = document.createElement('span');
    label.className = role;
    label.innerHTML = `<strong>${role === 'assistant' ? 'WhiskerBop 🐾' : 'You'}:</strong>`;
  
    // Create message content
    const content = document.createElement('div');
    content.className = 'message-content';
  
    // Render code blocks properly
    const formatted = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang || 'plaintext'}">${escapeHTML(code)}</code></pre>`;
    });
  
    content.innerHTML = formatted;
  
    // Append label and message
    div.appendChild(label);
    div.appendChild(content);
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  // Helper to escape characters for safe HTML rendering
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  

async function getGPTResponse(userMessage) {
    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    return data.reply;
}

async function fetchSavedChats() {
    try {
      const res = await fetch('/api/chats');
      const data = await res.json();
  
      // if (!Array.isArray(data)) {
      //   throw new Error('Expected array of chats');
      // }
  
      const chatList = document.getElementById('chat-list');
      chatList.innerHTML = '';
  
      data.forEach(chat => {
        const li = document.createElement('li');
        li.textContent = chat.title || 'Untitled Chat';
        li.dataset.chatId = chat.id;
        chatList.appendChild(li);
      });
    } catch (error) {
      console.error('Failed to fetch saved chats:', error);
    }
  }

  async function loadChatById(chatId) {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
  
      // You can now render `data.chat.messages` in your chat UI
      // Replace this with however you display messages
      const chatBox = document.getElementById('chat-messages');
      chatBox.innerHTML = '';
      data.chat.messages.forEach(msg => {
        const p = document.createElement('p');
        p.textContent = `${msg.role === 'user' ? 'You' : 'WhiskerBop 🐾'}: ${msg.content}`;
        chatBox.appendChild(p);
      });
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  }
  
