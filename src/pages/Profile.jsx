import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('smartspend-user')) || {};
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [budget, setBudget] = useState(() => Number(localStorage.getItem('smartspend-budget')) || 2000);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSave = () => {
    localStorage.setItem('smartspend-budget', budget);
    toast.success('Preferences saved!');
  };

  const handleLogout = () => {
    localStorage.removeItem('smartspend-token');
    localStorage.removeItem('smartspend-user');
    toast.success('Logged out!');
    navigate('/login');
  };

  return (
    <div className="p-6 flex flex-col gap-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-[80vh] transition-colors">
      <h2 className="text-3xl font-bold">👤 Profile & Settings</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block mb-1 text-sm">Full Name</label>
          <input
            value={name}
            disabled
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            value={email}
            disabled
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Monthly Budget ($)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>🌗 Enable Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="scale-125"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Save Preferences
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
