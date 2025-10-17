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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Metrics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default Dashboard;