import React, { useState } from 'react';
import { api } from '../services/api';
import QRCodeModal from './QRCodeModal';

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortCode('');

    const result = await api.shortenUrl(url);
    
    if (result.success && result.data) {
      setShortCode(result.data.shortCode);
      setUrl('');
    } else {
      setError(result.error || 'An error occurred');
    }
    
    setLoading(false);
  };

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  return (
    <>
      <div className="relative max-w-2xl mx-auto p-8 bg-primary dark:bg-dark-primary rounded-3xl shadow-neumorphic dark:shadow-neumorphic-dark overflow-hidden">
        <div className="absolute inset-0 bg-glow dark:bg-glow-blue opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-gray-700 dark:text-gray-300 mb-8 text-center">URL Shortener</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-lg font-medium text-gray-600 dark:text-gray-400 mb-3">
                Enter your long URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                required
                className="w-full px-5 py-4 bg-primary dark:bg-dark-primary rounded-2xl shadow-neumorphic-inset dark:shadow-neumorphic-dark-inset focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed py-4 px-6 rounded-2xl shadow-neumorphic hover:shadow-neumorphic-inset active:shadow-neumorphic-inset transition-all duration-200 font-semibold text-lg focus:outline-none"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 rounded-2xl shadow-neumorphic-inset dark:shadow-neumorphic-dark-inset">
              <p className="text-red-700 dark:text-red-300 text-center font-medium">{error}</p>
            </div>
          )}

          {shortCode && (
            <div className="mt-8 p-6 bg-primary dark:bg-dark-primary rounded-2xl shadow-neumorphic dark:shadow-neumorphic-dark">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-3 text-center">Your shortened URL:</p>
              <div className="flex items-center gap-4">
                <code className="flex-1 bg-primary dark:bg-dark-primary px-4 py-3 rounded-lg shadow-neumorphic-inset dark:shadow-neumorphic-dark-inset text-accent font-mono text-center text-lg">
                  {baseUrl}/{shortCode}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`${baseUrl}/${shortCode}`)}
                  className="px-5 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-neumorphic hover:shadow-neumorphic-inset active:shadow-neumorphic-inset transition-all duration-200 font-semibold focus:outline-none"
                >
                  Copy
                </button>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="px-5 py-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-neumorphic hover:shadow-neumorphic-inset active:shadow-neumorphic-inset transition-all duration-200 font-semibold focus:outline-none"
                >
                  QR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showQRModal && <QRCodeModal url={`${baseUrl}/${shortCode}`} onClose={() => setShowQRModal(false)} />}
    </>
  );
};

export default UrlShortener;