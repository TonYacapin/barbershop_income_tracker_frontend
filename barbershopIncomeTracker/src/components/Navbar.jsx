import React from 'react';

const Navbar = ({ setSelectedSection }) => {
  return (
    <nav style={styles.navbar}>
      <button style={styles.button} onClick={() => setSelectedSection('settings')}>
        Settings
      </button>
      <button style={styles.button} onClick={() => setSelectedSection('charts')}>
        Income Charts
      </button>
      <button style={styles.button} onClick={() => setSelectedSection('add-income')}>
        Add Income
      </button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    backgroundColor: '#555',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Navbar;