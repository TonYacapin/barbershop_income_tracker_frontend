import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const SettingsPage = () => {
  const [haircutPrice, setHaircutPrice] = useState('');
  const [ownerSharePercentage, setOwnerSharePercentage] = useState('');
  const [message, setMessage] = useState('');

  // Fetch existing income settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/api/income-settings');
        console.log('Fetched settings:', response.data); // Debugging line

        // Access the nested settings object
        const { haircutPrice, ownerSharePercentage } = response.data.settings;

        // Populate input fields with existing settings
        setHaircutPrice(haircutPrice ?? '');
        setOwnerSharePercentage(ownerSharePercentage ?? '');
      } catch (error) {
        console.error('Error fetching income settings:', error);
        setMessage('Failed to load settings. Please try again.');
      }
    };

    fetchSettings();
  }, []);

  // Handle form submission to update settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages

    try {
      await axiosInstance.post('/api/income-settings', {
        haircutPrice,
        ownerSharePercentage,
      });
      setMessage('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating income settings:', error);
      setMessage('Failed to update settings. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="haircutPrice">Haircut Price:</label>
          <input
            type="number"
            id="haircutPrice"
            value={haircutPrice || ''} // Ensure value is always defined
            onChange={(e) => setHaircutPrice(e.target.value)}
            required
            min="0"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="ownerSharePercentage">Owner Share Percentage:</label>
          <input
            type="number"
            id="ownerSharePercentage"
            value={ownerSharePercentage || ''} // Ensure value is always defined
            onChange={(e) => setOwnerSharePercentage(e.target.value)}
            required
            min="0"
            max="100"
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Save Settings
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
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
};

export default SettingsPage;