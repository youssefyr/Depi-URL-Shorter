import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UrlShortener from './components/UrlShortener';
import Dashboard from './components/Dashboard';
import Statistics from './components/Statistics';

function App() {
  // Force dark theme only (remove theme switching)


  return (
    <Router future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          <nav className="w-full mb-8 flex justify-center items-center">
            <div className="flex space-x-4 sm:space-x-8">
              <Link
                to="/"
                className="text-lg font-medium text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 sm:px-4 transition-all duration-300 hover:shadow-neumorphic-inset dark:hover:shadow-neumorphic-dark-inset active:shadow-neumorphic-inset dark:active:shadow-neumorphic-dark-inset focus:outline-none"
              >
                URL Shortener
              </Link>
              <Link
                to="/dashboard"
                className="text-lg font-medium text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 sm:px-4 transition-all duration-300 hover:shadow-neumorphic-inset dark:hover:shadow-neumorphic-dark-inset active:shadow-neumorphic-inset dark:active:shadow-neumorphic-dark-inset focus:outline-none"
              >
                Dashboard
              </Link>
            </div>
          </nav>

          <main>
            <Routes>
              <Route path="/" element={<UrlShortener />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stats/:shortCode" element={<Statistics />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;