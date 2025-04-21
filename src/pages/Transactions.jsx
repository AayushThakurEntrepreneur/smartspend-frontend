import React, { useEffect, useState } from 'react';
import TransactionModal from '../components/TransactionModal';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);

  const fetchTransactions = async () => {
    const token = localStorage.getItem('smartspend-token');
    if (!token) {
      toast.error('User not authenticated. Please login again.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch transactions');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const openModal = (txn = null) => {
    setEditingTxn(txn);
    setIsModalOpen(true);
  };

  const saveTransaction = (newTxn) => {
    setTransactions((prev) => {
      const updated = editingTxn
        ? prev.map((txn) => (txn._id === newTxn._id ? newTxn : txn))
        : [newTxn, ...prev];
      return updated;
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('smartspend-token');
    const confirm = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/transactions/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Transaction deleted!');
      setTransactions((prev) => prev.filter((txn) => txn._id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete transaction');
    }
  };

  const filtered = transactions.filter((txn) => {
    const matchesSearch = txn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (txn.note && txn.note.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || txn.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'All' || txn.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesMethod = methodFilter === 'All' || txn.method.toLowerCase() === methodFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory && matchesMethod;
  });

  const downloadCSV = () => {
    const header = ['ID', 'Status', 'Name', 'Date', 'Amount', 'Method', 'Category', 'Note'];
    const rows = filtered.map((t) =>
      [t._id, t.status, t.name, new Date(t.date).toLocaleDateString(), t.amount, t.method, t.category, t.note || ''].join(',')
    );
    const csvContent = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filterClass = 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded';

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 flex flex-col flex-grow px-4 lg:px-6 pb-6 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Transactions</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 items-center justify-between">
        <input
          type="text"
          placeholder="Search by name or note..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={filterClass + ' w-full lg:w-1/4'}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={filterClass}>
          <option value="All">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={filterClass}>
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
        </select>
        <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className={filterClass}>
          <option value="All">All Methods</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
        </select>
        <button onClick={downloadCSV} className={filterClass}>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-auto">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 uppercase font-semibold">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn) => (
              <tr
                key={txn._id}
                className={`border-b hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  txn.status === 'Failed' ? 'bg-red-50 dark:bg-red-900' : 'bg-white dark:bg-gray-700'
                }`}
              >
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{txn._id.slice(-6)}</td>
                <td className={`px-4 py-2 font-medium ${
                  txn.status === 'Failed'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {txn.status}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{txn.name}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{new Date(txn.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">${txn.amount.toFixed(2)}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{txn.method}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{txn.category}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{txn.note}</td>
                <td className="px-4 py-2 text-right flex justify-end gap-2">
                  <button
                    onClick={() => openModal(txn)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-white"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(txn._id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-white"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No transactions match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveTransaction}
        editingTxn={editingTxn}
      />
    </div>
  );
};

export default Transactions;
