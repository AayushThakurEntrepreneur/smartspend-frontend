import { useState } from 'react';
import ChatbotUI from '../components/ChatbotUI';

const Chatbot = () => {
  const [activePrompt, setActivePrompt] = useState('');
  const quickPrompts = [
    "Suggest budget improvements",
    "Predict next week's expenses",
    "Analyze my food spending",
    "Tips to save more this month",
    "Am I overspending?"
  ];

  return (
    <div className="flex flex-col flex-grow px-4 lg:px-6 pb-6 bg-gray-50 dark:bg-gray-900 transition-colors">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mt-6 mb-4">
        Chat with SmartBot 🤖
      </h2>

      <div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-md p-6 max-w-4xl mx-auto mb-6 text-center">
        <p className="text-sm mb-3">
          💬 Ask SmartBot anything about budgeting, savings, or spending insights.
        </p>
        <p className="text-sm">
          📈 Your assistant is powered by AI and learns from your trends.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-6 max-w-4xl mx-auto">
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => setActivePrompt(prompt)}
            className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-800 dark:text-white rounded transition duration-200 shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-4xl mx-auto w-full">
        <ChatbotUI initialPrompt={activePrompt} setInitialPrompt={setActivePrompt} />
      </div>
    </div>
  );
};

export default Chatbot;
