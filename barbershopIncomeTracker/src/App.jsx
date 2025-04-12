import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './auth/ProtectedRoute';
import MainPage from './pages/MainPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Route */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;