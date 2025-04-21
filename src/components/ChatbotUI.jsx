import React, { useEffect, useState } from 'react';

const ChatbotUI = ({ initialPrompt, setInitialPrompt }) => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! I'm your SmartSpend Assistant 💬 Ask me anything about savings or spending." }
  ]);
  const [input, setInput] = useState('');
  const apiKey = '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';

  const sendMessage = async (msgToSend) => {
    const userMsg = msgToSend || input;
    if (!userMsg.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    if (setInitialPrompt) setInitialPrompt('');

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          messages: [
            { role: 'system', content: 'You are a helpful assistant for personal finance and budgeting queries.' },
            { role: 'user', content: userMsg }
          ]
        })
      });

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;

      setMessages(prev => [...prev, {
        role: 'bot',
        text: reply || '⚠️ No reply received from SmartSpend AI.'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '❌ Network error. Try again later.'
      }]);
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-3 text-sm p-2">
        {messages.map((msg, i) => (
          <div
            key={i}
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
      <div className="flex gap-2 border-t p-3 mt-auto">
        <input
          id="chatbot-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a question..."
          className="flex-1 p-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-700"
        />
        <button
          onClick={() => sendMessage()}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotUI;
