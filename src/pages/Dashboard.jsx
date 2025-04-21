// Dashboard.jsx

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import html2pdf from 'html2pdf.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedChart, setSelectedChart] = useState('bar');
  const [goal, setGoal] = useState(1000);
  const [editingGoal, setEditingGoal] = useState(false);
  const token = localStorage.getItem('smartspend-token');
  const exportRef = useRef();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = Array.from(new Set(transactions.map((t) => new Date(t.date).getFullYear().toString())));

  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setTransactions(res.data))
    .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let filteredData = transactions;
    if (selectedMonth) {
      filteredData = filteredData.filter(
        (t) => new Date(t.date).toLocaleString('default', { month: 'short' }) === selectedMonth
      );
    }
    if (selectedYear) {
      filteredData = filteredData.filter((t) => new Date(t.date).getFullYear().toString() === selectedYear);
    }
    setFiltered(filteredData);
  }, [transactions, selectedMonth, selectedYear]);

  const getCategoryStats = () => {
    const data = {};
    filtered.forEach((t) => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return data;
  };

  const getMonthlyStats = () => {
    const data = {};
    filtered.forEach((t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      data[month] = (data[month] || 0) + t.amount;
    });
    return data;
  };

  const barData = {
    labels: Object.keys(getCategoryStats()),
    datasets: [{
      label: 'Spending',
      data: Object.values(getCategoryStats()),
      backgroundColor: ['#60A5FA88', '#F8717188', '#34D39988', '#FBBF2488', '#A78BFA88']
    }],
  };

  const pieData = {
    labels: Object.keys(getCategoryStats()),
    datasets: [{
      label: 'Share',
      data: Object.values(getCategoryStats()),
      backgroundColor: ['#60A5FA88', '#F8717188', '#34D39988', '#FBBF2488', '#A78BFA88'],
      borderWidth: 1,
    }],
  };

  const lineData = {
    labels: Object.keys(getMonthlyStats()),
    datasets: [{
      label: 'Trend',
      data: Object.values(getMonthlyStats()),
      borderColor: '#3B82F6',
      backgroundColor: '#93C5FD88',
      fill: false,
      tension: 0.4,
    }],
  };

  const total = filtered.reduce((sum, t) => sum + t.amount, 0);
  const progress = Math.min((total / goal) * 100, 100).toFixed(0);
  const recurring = filtered.filter((t, _, arr) =>
    arr.some(other => other.name === t.name && other._id !== t._id)
  );

  return (
    <div className="flex flex-col px-4 lg:px-6 pb-10 bg-gray-50 dark:bg-gray-900 transition-colors">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mt-4 mb-6">SmartSpend Dashboard</h2>

      {/* Filters & Export */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-4">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="input-box">
            <option value="">All Months</option>
            {months.map((m, i) => <option key={i} value={m}>{m}</option>)}
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="input-box">
            <option value="">All Years</option>
            {years.map((y, i) => <option key={i} value={y}>{y}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={() => html2pdf().from(exportRef.current).save('dashboard.pdf')} className="btn-green">Export PDF</button>
          <button onClick={() => {
            const csv = [
              ['Name', 'Amount', 'Date', 'Method', 'Category', 'Status', 'Note'],
              ...filtered.map((t) => [t.name, t.amount, new Date(t.date).toLocaleDateString(), t.method, t.category, t.status, t.note || '']),
            ]
              .map((row) => row.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'transactions.csv'; a.click();
            URL.revokeObjectURL(url);
          }} className="btn-blue">Export CSV</button>
        </div>
      </div>

      <div ref={exportRef}>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {[{ label: 'Total Spent', value: `$${total.toFixed(2)}`, icon: '💰' },
            { label: 'Top Category', value: Object.keys(getCategoryStats())[0] || 'N/A', icon: '📦' },
            { label: 'Most Used Method', value: Object.entries(getCategoryStats())[0]?.[0] || 'N/A', icon: '💳' },
            { label: 'Transactions', value: filtered.length, icon: '📄' },
            {
              label: 'Savings Goal',
              value: editingGoal ? (
                <input value={goal} onChange={(e) => setGoal(e.target.value)} onBlur={() => setEditingGoal(false)}
                  className="w-20 p-1 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600"
                />
              ) : `$${goal}`, icon: '🎯', onClick: () => setEditingGoal(true)
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded shadow text-gray-900 dark:text-white" onClick={item.onClick}>
              <div className="text-xl">{item.icon}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">{item.label}</div>
              <div className="text-lg font-semibold">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Budget Progress Ring */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Goal Completion</h3>
          <div className="relative w-24 h-24">
            <svg className="absolute top-0 left-0 w-full h-full">
              <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#3B82F6" strokeWidth="8"
                strokeDasharray="251.2" strokeDashoffset={`${251.2 * (1 - progress / 100)}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">{progress}%</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow h-[260px] hover:scale-105 transition duration-200">
            <div className="flex justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Spending by Category</h3>
              <select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)} className="text-sm rounded px-2 py-1">
                <option value="bar">Bar</option>
                <option value="pie">Pie</option>
                <option value="line">Line</option>
              </select>
            </div>
            {selectedChart === 'bar' && <Bar data={barData} />}
            {selectedChart === 'pie' && <Pie data={pieData} />}
            {selectedChart === 'line' && <Line data={lineData} />}
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow h-[260px] flex flex-col justify-center transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Next Week Prediction</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">Expect a rise in <strong>Travel</strong> expenses — plan accordingly.</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">Recommended: Reduce Food spending by <strong>₹400</strong> this week.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow h-[260px] flex flex-col justify-center transition-transform hover:scale-105">
            <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Smart Alerts 🚨</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1">
              <li>Food limit nearing: ₹850/1000</li>
              <li>Shopping spike detected (↑20%)</li>
              <li>Consider switching utilities to autopay</li>
            </ul>
          </div>
        </div>

        {/* Recurring Transactions */}
        {recurring.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Recurring Transactions</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc ml-5 space-y-1">
              {recurring.slice(0, 5).map((t, i) => <li key={i}>{t.name} - ₹{t.amount}</li>)}
            </ul>
          </div>
        )}

        {/* Weekly Insights + Ask Button */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mt-6 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">🧠 GPT-Powered Weekly Insights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">“Your weekend spending spikes between 6–9pm. Consider budgeting ahead.”</p>
          <button
            className="w-fit mt-2 text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={() => window.location.href = '/chatbot'}
          >
            Ask SmartSpend 💬
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
