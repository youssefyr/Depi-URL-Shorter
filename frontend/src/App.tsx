import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import UrlShortener from './components/UrlShortener';
import Dashboard from './components/Dashboard';
import Statistics from './components/Statistics';

function App() {
  return (
    <Router future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shortener" element={<UrlShortener />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stats/:shortCode" element={<Statistics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;