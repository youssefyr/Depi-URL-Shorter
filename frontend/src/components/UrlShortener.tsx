import React, { useState } from 'react';
import { api } from '../services/api';

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">URL Shortener</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your long URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {shortCode && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-gray-600 mb-2">Your shortened URL:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-3 py-2 rounded border text-blue-600 font-mono">
              {baseUrl}/{shortCode}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(`${baseUrl}/${shortCode}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;