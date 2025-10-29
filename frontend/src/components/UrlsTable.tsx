import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { UrlRecord } from '../types';
import QRCodeModal from './QRCodeModal';

const UrlsTable: React.FC = () => {
  const [urls, setUrls] = useState<UrlRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');

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

  const handleShowQR = (shortCode: string) => {
    setSelectedUrl(`${baseUrl}/${shortCode}`);
    setShowQRModal(true);
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
    <>
      <div className="relative bg-primary dark:bg-dark-primary rounded-2xl shadow-neumorphic dark:shadow-neumorphic-dark p-6 overflow-hidden">
        <div className="absolute inset-0 bg-glow dark:bg-glow-blue opacity-10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">All Shortened URLs</h2>
            <span className="text-lg text-gray-600 dark:text-gray-400 shadow-neumorphic-inset dark:shadow-neumorphic-dark-inset px-4 py-2 rounded-xl">{urls.length} total</span>
          </div>
          
          {urls.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-lg">
              No URLs shortened yet. Create your first one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-primary dark:bg-dark-primary">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-primary dark:bg-dark-primary divide-y divide-gray-200 dark:divide-gray-700">
                  {urls.map((url) => (
                    <tr key={url.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-md font-mono text-accent">
                          {url.short_code}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-md text-gray-800 dark:text-gray-300 max-w-md truncate" title={url.original_url}>
                          {url.original_url}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-md leading-5 font-semibold rounded-full shadow-neumorphic-inset dark:shadow-neumorphic-dark-inset text-gray-700 dark:text-gray-300">
                          {url.clicks}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600 dark:text-gray-400">
                        {formatDate(url.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md font-medium space-x-4">
                        <button
                          onClick={() => copyToClipboard(`${baseUrl}/${url.short_code}`)}
                          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-neumorphic hover:shadow-neumorphic-inset active:shadow-neumorphic-inset transition-all duration-200 focus:outline-none"
                          title="Copy short URL"
                        >
                          Copy
                        </button>
                        <a
                          href={`${baseUrl}/${url.short_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-neumorphic hover:shadow-neumorphic-inset active:shadow-neumorphic-inset transition-all duration-200 focus:outline-none"
                        >
                          Visit
                        </a>
                        <button
                          onClick={() => handleShowQR(url.short_code)}
                          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-neumorphic hover:shadow-neumorphic-inset active:shadow-neumorphic-inset transition-all duration-200 focus:outline-none"
                          title="Generate QR Code"
                        >
                          QR
                        </button>
                        <Link
                          to={`/stats/${url.short_code}`}
                          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg shadow-neumorphic hover:shadow-neumorphic-inset active:shadow-neumorphic-inset transition-all duration-200 focus:outline-none"
                          title="View Stats"
                        >
                          Stats
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {showQRModal && <QRCodeModal url={selectedUrl} onClose={() => setShowQRModal(false)} />}
    </>
  );
};

export default UrlsTable;