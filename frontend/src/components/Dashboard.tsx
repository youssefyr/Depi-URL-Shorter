import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { MetricsData } from '../types';
import MetricsCard from './MetricsCard';
import UrlsTable from './UrlsTable';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      const result = await api.getMetrics();
      
      if (result.success && result.data) {
        setMetrics(result.data);
        setError('');
      } else {
        setError(result.error || 'Failed to load metrics');
      }
      
      setLoading(false);
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 dark:bg-red-900 rounded-2xl shadow-neumorphic-inset dark:shadow-neumorphic-dark-inset">
        <p className="text-red-700 dark:text-red-300 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      <div className="absolute inset-0 bg-glow dark:bg-glow-blue opacity-10"></div>
      <div className="relative z-10">
        <h2 className="text-4xl font-bold text-gray-700 dark:text-gray-300 text-center">Metrics Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <MetricsCard
            title="URLs Shortened"
            value={metrics?.urlsShortened || 0}
            description="Total URLs created"
          />
          
          <MetricsCard
            title="Successful Redirects"
            value={metrics?.successfulRedirects || 0}
            description="Total successful visits"
          />
          
          <MetricsCard
            title="Failed Lookups (404)"
            value={metrics?.failedLookups || 0}
            description="URLs not found"
          />
          
          <MetricsCard
            title="Average Latency"
            value={`${metrics?.averageLatency?.toFixed(2) || 0}ms`}
            description="Mean response time"
          />
          
          <MetricsCard
            title="95th Percentile Latency"
            value={`${metrics?.p95Latency?.toFixed(2) || 0}ms`}
            description="P95 response time"
          />
        </div>

        <UrlsTable />
      </div>
    </div>
  );
};

export default Dashboard;