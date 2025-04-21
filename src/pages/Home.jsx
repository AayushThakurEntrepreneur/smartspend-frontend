import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthlySpend, setMonthlySpend] = useState(0);
  const [budget, setBudget] = useState(() => Number(localStorage.getItem('smartspend-budget')) || 2000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editedBudget, setEditedBudget] = useState(budget);

  const token = localStorage.getItem('smartspend-token');
  const user = JSON.parse(localStorage.getItem('smartspend-user'));
  const userName = user?.name?.split(' ')[0] || 'User';

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const txns = res.data;
        setTransactions(txns);

        const currentMonth = new Date().getMonth();
        const currentMonthSpend = txns
          .filter((t) => new Date(t.date).getMonth() === currentMonth)
          .reduce((sum, t) => sum + t.amount, 0);

        setMonthlySpend(currentMonthSpend);

        if (txns.length === 0) toast('No transactions found yet. Start by adding one! 💸');
      })
      .catch((err) => console.error(err));
  }, []);

  const handleBudgetSave = () => {
    localStorage.setItem('smartspend-budget', editedBudget);
    setBudget(editedBudget);
    setIsEditingBudget(false);
    toast.success('Budget updated!');
  };

  const categoryStats = transactions.reduce((acc, t) => {
    const cat = t.category;
    acc[cat] = (acc[cat] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryStats),
    datasets: [
      {
        label: 'Spent',
        data: Object.values(categoryStats),
        backgroundColor: ['#60A5FAaa', '#F87171aa', '#34D399aa', '#FBBF24aa', '#A78BFAaa'],
        borderWidth: 1,
      },
    ],
  };

  const remaining = budget - monthlySpend;
  const percentageUsed = Math.min((monthlySpend / budget) * 100, 100).toFixed(1);

  const topCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const averageTxn = transactions.length > 0 ? (transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(2) : 0;
  const failedTxns = transactions.filter((t) => t.status === 'Failed').length;
  const successTxns = transactions.filter((t) => t.status === 'Success').length;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 flex flex-col flex-grow px-4 lg:px-6 pb-6 transition-colors">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        Welcome back, {userName} 👋
      </h2>
      <p className="text-gray-500 dark:text-gray-300 mb-8">
        Here's your financial health snapshot for this month.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          { icon: '📊', label: 'Monthly Budget', value: `$${budget}`, edit: true },
          { icon: '🧾', label: 'Spent This Month', value: `$${monthlySpend.toFixed(2)}` },
          { icon: '✅', label: 'Remaining Budget', value: `$${remaining.toFixed(2)}` },
          { icon: '📈', label: 'Usage %', value: `${percentageUsed}%`, class: percentageUsed > 90 ? 'text-red-600' : percentageUsed > 70 ? 'text-yellow-500' : 'text-green-600' },
          { icon: '📂', label: 'Transactions', value: transactions.length },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow p-5">
            <div className="text-3xl">{item.icon}</div>
            <div className="text-sm mt-2 text-gray-500 dark:text-gray-300">{item.label}</div>
            {item.edit && isEditingBudget ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={editedBudget}
                  onChange={(e) => setEditedBudget(e.target.value)}
                  className="px-2 py-1 rounded text-black dark:text-white bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 w-20"
                />
                <button onClick={handleBudgetSave} className="text-green-600 hover:underline">Save</button>
              </div>
            ) : (
              <div className={`text-xl font-semibold flex items-center gap-2 ${item.class || ''}`}>
                {item.value}
                {item.edit && (
                  <button onClick={() => setIsEditingBudget(true)} className="text-blue-600 text-sm hover:underline">Edit</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link to="/transactions" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded">➕ Add Transaction</Link>
        <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded">📊 View Dashboard</Link>
        <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded">🖨️ Print Report</button>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Recent Activity</h3>
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-300">No transactions available yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
              {transactions.slice(0, 5).map((t) => (
                <li key={t._id} className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span>{t.name}</span>
                  <span className={t.status === 'Failed' ? 'text-red-500' : 'text-green-600'}>
                    ${t.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Spending by Category</h3>
          <div className="h-[200px]">
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Smart Tips 💡</h3>
        <ul className="text-sm text-gray-500 dark:text-gray-300 list-disc ml-5 space-y-1">
          <li>You've spent <strong>{percentageUsed}%</strong> of your monthly budget.</li>
          <li>Top category this month: <strong>{topCategory}</strong></li>
          <li>Average transaction: <strong>${averageTxn}</strong></li>
          <li>Failed transactions this month: <strong>{failedTxns}</strong></li>
          <li>Successful transactions: <strong>{successTxns}</strong></li>
          <li>Consider reducing dine-out frequency to boost savings.</li>
          <li>Explore budget-friendly alternatives on fixed expenses.</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
