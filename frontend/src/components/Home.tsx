import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="hero min-h-[calc(100vh-4rem)]">
      <div className="hero-content text-center">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to LinkShort
            </h1>
            <p className="text-xl md:text-2xl text-base-content/70">
              Transform your long URLs into short, shareable links in seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h2 className="card-title">Lightning Fast</h2>
                <p>Shorten URLs instantly with our optimized service</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-5xl mb-4">📊</div>
                <h2 className="card-title">Analytics</h2>
                <p>Track clicks and monitor your links performance</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-5xl mb-4">📱</div>
                <h2 className="card-title">QR Codes</h2>
                <p>Generate QR codes for easy mobile sharing</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/shortener" className="btn btn-primary btn-lg">
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-lg">
              View Dashboard
            </Link>
          </div>

          <div className="stats stats-vertical lg:stats-horizontal shadow mt-12 w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title">Total URLs</div>
              <div className="stat-value text-primary">Live</div>
              <div className="stat-desc">Real-time tracking</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <div className="stat-title">Click Tracking</div>
              <div className="stat-value text-secondary">24/7</div>
              <div className="stat-desc">Monitor performance</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-accent">
                <div className="avatar online">
                  <div className="w-16 rounded-full">
                    <div className="bg-accent flex items-center justify-center h-full text-3xl">
                      🔗
                    </div>
                  </div>
                </div>
              </div>
              <div className="stat-title">Response Time</div>
              <div className="stat-value text-accent">&lt;1s</div>
              <div className="stat-desc">Ultra-fast redirects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;