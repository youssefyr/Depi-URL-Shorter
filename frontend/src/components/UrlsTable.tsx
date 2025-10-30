import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { UrlRecord } from '../types';

const UrlsTable: React.FC = () => {
  const [urls, setUrls] = useState<UrlRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    const interval = setInterval(fetchUrls, 15000);

    return () => clearInterval(interval);
  }, []);

  const baseUrl = window.location.origin;

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">All Shortened URLs</h2>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="bg-base-200">
                <th className="font-bold">Short Code</th>
                <th className="font-bold">Original URL</th>
                <th className="font-bold">Clicks</th>
                <th className="font-bold">Created</th>
                <th className="font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-base-content/70">
                    No URLs created yet
                  </td>
                </tr>
              ) : (
                urls.map((url) => (
                  <tr key={url.id} className="hover">
                    <td>
                      <a
                        href={`${baseUrl}/go/${url.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary font-mono font-bold"
                      >
                        {url.short_code}
                      </a>
                    </td>
                    <td className="max-w-xs truncate" title={url.original_url}>
                      <span className="text-base-content">{url.original_url}</span>
                    </td>
                    <td>
                      <div className="badge badge-primary badge-lg font-bold">
                        {url.clicks || 0}
                      </div>
                    </td>
                    <td className="text-base-content/70">
                      {new Date(url.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(`${baseUrl}/go/${url.short_code}`)}
                          className="btn btn-ghost btn-xs"
                          title="Copy URL"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <Link
                          to={`/stats/${url.short_code}`}
                          className="btn btn-ghost btn-xs"
                          title="View Stats"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UrlsTable;