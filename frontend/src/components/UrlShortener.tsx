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

  const baseUrl = window.location.origin;
  const shortUrl = shortCode ? `${baseUrl}/go/${shortCode}` : '';

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
          <div className="card-body">
            <h2 className="card-title text-3xl md:text-4xl font-bold text-center justify-center mb-6">
              🔗 URL Shortener
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label" htmlFor="url">
                  <span className="label-text text-lg">Enter your long URL</span>
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  required
                  className="input input-bordered input-primary w-full text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-lg"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Shortening...
                  </>
                ) : (
                  'Shorten URL'
                )}
              </button>
            </form>

            {error && (
              <div className="alert alert-error mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {shortCode && (
              <div className="card bg-base-200 shadow-xl mt-6">
                <div className="card-body">
                  <h3 className="card-title text-lg">Your shortened URL:</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <div className="mockup-code bg-base-300">
                        <pre data-prefix="$"><code className="text-primary">{shortUrl}</code></pre>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button
                      onClick={() => navigator.clipboard.writeText(shortUrl)}
                      className="btn btn-primary btn-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                    <button
                      onClick={() => setShowQRModal(true)}
                      className="btn btn-secondary btn-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      QR Code
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showQRModal && <QRCodeModal url={shortUrl} onClose={() => setShowQRModal(false)} />}
    </>
  );
};

export default UrlShortener;