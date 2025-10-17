import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { UrlRecord } from '../types';

const UrlsTable: React.FC = () => {
  const [urls, setUrls] = useState<UrlRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchUrls = async () => {
      const result = await api.getAllUrls();
      
      if (result.success && result.data) {
        setUrls(result.data);
        setError('');
      } else {
        setError(result.error || 'Failed to load URLs');
      }
      
      setLoading(false);
    };

    fetchUrls();
    const interval = setInterval(fetchUrls, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Shortened URLs</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Shortened URLs</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">All Shortened URLs</h2>
        <span className="text-sm text-gray-600">{urls.length} total URLs</span>
      </div>
      
      {urls.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No URLs shortened yet. Create your first one above!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Short Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {urls.map((url) => (
                <tr key={url.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm font-mono text-blue-600">
                      {url.short_code}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md truncate" title={url.original_url}>
                      {url.original_url}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {url.clicks}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(url.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => copyToClipboard(`${baseUrl}/${url.short_code}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Copy short URL"
                    >
                      Copy
                    </button>
                    <a
                      href={`${baseUrl}/${url.short_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-900"
                    >
                      Visit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UrlsTable;