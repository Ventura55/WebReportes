import React from 'react';
import LoginForm from './LoginForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppMain from './AppMain';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/main" element={<AppMain />} />
      </Routes>
    </Router>
  );
}

export default App;
