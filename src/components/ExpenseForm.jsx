import React, { useState } from 'react';

const ExpenseForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    category: '',
    date: '',
    note: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return alert('Please fill in required fields');

    setExpenses([...expenses, form]);
    setForm({ amount: '', category: '', date: '', note: '' });
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold text-blue-600">Add New Expense</h2>

        <input
          type="number"
          name="amount"
          placeholder="Amount ($)"
          value={form.amount}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Rent">Rent</option>
          <option value="Travel">Travel</option>
          <option value="Others">Others</option>
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Optional Note"
          className="border p-2 rounded"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Expense
        </button>
      </form>

      {/* Recent Entries */}
      {expenses.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Recent Expenses</h3>
          <ul className="text-sm space-y-1">
            {expenses.map((exp, i) => (
              <li key={i}>
                💸 ${exp.amount} - {exp.category} on {exp.date || 'N/A'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExpenseForm;
