import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile'; // ✅ NEW
import AuthRoute from './components/AuthRoute';
import { Toaster } from 'react-hot-toast';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white bg-white text-black transition-colors">
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex-grow">
          <Routes>
            {/* 🔓 Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🔐 Protected Routes */}
            <Route path="/" element={<AuthRoute><Home /></AuthRoute>} />
            <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
            <Route path="/transactions" element={<AuthRoute><Transactions /></AuthRoute>} />
            <Route path="/chatbot" element={<AuthRoute><Chatbot /></AuthRoute>} />
            <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
          </Routes>

        </div>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;
