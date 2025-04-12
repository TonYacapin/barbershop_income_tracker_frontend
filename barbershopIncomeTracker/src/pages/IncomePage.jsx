import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({
    source: '',
    numberOfHeads: '',
    isOwner: false,
  });
  const [message, setMessage] = useState('');
  const [editingIncomeId, setEditingIncomeId] = useState(null);

  // Fetch all income records on component mount
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axiosInstance.get('/api/income');
        console.log('Fetched incomes:', response.data); // Debugging line
        setIncomes(response.data.incomes);
      } catch (error) {
        console.error('Error fetching income records:', error);
      }
    };

    fetchIncomes();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission for creating or updating income
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingIncomeId) {
        // Update existing income
        await axiosInstance.put(`/api/income/${editingIncomeId}`, formData);
        setMessage('Income record updated successfully!');
      } else {
        // Create new income
        await axiosInstance.post('/api/income', formData);
        setMessage('Income record created successfully!');
      }

      // Refresh income records
      const response = await axiosInstance.get('/api/income');
      setIncomes(response.data.incomes);

      // Reset form
      setFormData({ source: '', numberOfHeads: '', isOwner: false });
      setEditingIncomeId(null);
    } catch (error) {
      console.error('Error saving income record:', error);
      setMessage('Failed to save income record. Please try again.');
    }
  };

  // Handle deleting an income record
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/income/${id}`);
      setMessage('Income record deleted successfully!');

      // Refresh income records
      const response = await axiosInstance.get('/api/income');
      setIncomes(response.data.incomes);
    } catch (error) {
      console.error('Error deleting income record:', error);
      setMessage('Failed to delete income record. Please try again.');
    }
  };

  // Handle editing an income record
  const handleEdit = (income) => {
    setFormData({
      source: income.source,
      numberOfHeads: income.numberOfHeads,
      isOwner: income.ownerShare === 0, // Determine if the record is for the owner
    });
    setEditingIncomeId(income._id);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={styles.container}>
      <h1>Income Management</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="source">Source (Name of Barber):</label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="numberOfHeads">Number of Heads:</label>
          <input
            type="number"
            id="numberOfHeads"
            name="numberOfHeads"
            value={formData.numberOfHeads}
            onChange={handleInputChange}
            required
            min="0"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="isOwner"
              checked={formData.isOwner}
              onChange={handleInputChange}
            />
            Is Owner
          </label>
        </div>
        <button type="submit" style={styles.button}>
          {editingIncomeId ? 'Update Income' : 'Add Income'}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <h2>Income Records</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Source</th>
            <th>Number of Heads</th>
            <th>Income</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income._id}>
              <td>{income.source}</td>
              <td>{income.numberOfHeads}</td>
              <td>{income.income}</td>
              <td>{formatDate(income.createdAt)}</td>
              <td>
                <button onClick={() => handleEdit(income)} style={styles.actionButton}>
                  Edit
                </button>
                <button onClick={() => handleDelete(income._id)} style={styles.actionButton}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '15px',
    fontSize: '14px',
    color: 'green',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  actionButton: {
    margin: '0 5px',
    padding: '5px 10px',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default IncomePage;