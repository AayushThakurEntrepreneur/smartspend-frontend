import React, { useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hey! I\'m your SmartSpend Assistant 💬 Ask me anything about savings, expenses or budgeting.' }
  ]);
  const [input, setInput] = useState('');

  const apiKey = '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'; // ✅ your OpenRouter key

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct', // ✅ required model
          messages: [
            { role: 'system', content: 'You are a helpful assistant for personal finance and budgeting queries.' },
            { role: 'user', content: input }
          ]
        })
      });

      const data = await res.json();
      console.log("✅ OpenRouter API Response:", data);

      const reply = data?.choices?.[0]?.message?.content;

      if (reply) {
        setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Sorry, no response from OpenChat.' }]);
      }

    } catch (err) {
      console.error('❌ Network or fetch error:', err);
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Oops! Network error. Please try again.' }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
      >
        {open ? <FaTimes size={20} /> : <FaRobot size={20} />}
      </button>

      {/* Chat Popup */}
      {open && (
        <div className="fixed bottom-20 right-5 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg w-80 h-96 flex flex-col z-50">
          <div className="p-3 font-bold border-b dark:border-gray-600">SmartSpend Assistant</div>
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  msg.role === 'user'
                    ? 'bg-blue-100 dark:bg-blue-700 text-right'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t dark:border-gray-600 flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
