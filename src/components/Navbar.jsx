import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaChartBar, FaMoneyBill, FaRobot, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark';
    setDarkMode(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('smartspend-token');
    localStorage.removeItem('smartspend-user');
    toast.success('Logged out successfully!');
    navigate('/login'); // 👈 Redirects after logout
  };
  

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-white">SmartSpend</h1>
        <div className="flex items-center gap-6">
          <ul className="flex gap-6 text-gray-700 dark:text-gray-200 font-medium">
            <li className="hover:text-blue-500">
              <Link to="/" className="flex items-center gap-1"><FaHome /> Home</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to="/dashboard" className="flex items-center gap-1"><FaChartBar /> Dashboard</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to="/transactions" className="flex items-center gap-1"><FaMoneyBill /> Transactions</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to="/chatbot" className="flex items-center gap-1"><FaRobot /> Chatbot</Link>
            </li>
            <li className="hover:text-blue-500">
              <Link to="/profile" className="flex items-center gap-1"><FaUser /> Profile</Link>
            </li>
          </ul>

          <button
            onClick={toggleDarkMode}
            className="text-sm bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold ml-2"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
