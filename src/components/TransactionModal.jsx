import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TransactionModal = ({ isOpen, onClose, onSave, editingTxn }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: '',
    method: 'UPI',
    category: 'Food',
    note: '',
    status: 'Success',
  });

  const token = localStorage.getItem('smartspend-token');

  useEffect(() => {
    if (editingTxn) {
      setFormData({
        name: editingTxn.name,
        amount: editingTxn.amount,
        date: editingTxn.date.slice(0, 10),
        method: editingTxn.method,
        category: editingTxn.category,
        note: editingTxn.note || '',
        status: editingTxn.status,
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        date: '',
        method: 'UPI',
        category: 'Food',
        note: '',
        status: 'Success',
      });
    }
  }, [editingTxn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingTxn) {
        // PUT for editing
        res = await axios.put(
          `http://localhost:5000/api/transactions/update/${editingTxn._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Transaction updated!');
      } else {
        // POST for new
        res = await axios.post(
          'http://localhost:5000/api/transactions/add',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Transaction added!');
      }

      onSave(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save transaction');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-md w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          {editingTxn ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="name"
              placeholder="Transaction Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-box"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="input-box"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="input-box"
            />
            <select name="method" value={formData.method} onChange={handleChange} className="input-box">
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>
            <select name="category" value={formData.category} onChange={handleChange} className="input-box">
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
            </select>
            <select name="status" value={formData.status} onChange={handleChange} className="input-box">
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
            <textarea
              name="note"
              placeholder="Note (optional)"
              value={formData.note}
              onChange={handleChange}
              className="input-box resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingTxn ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
