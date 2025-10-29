import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ClickStat {
  clicked_at: string;
  user_agent: string;
  referrer: string;
}

const Statistics: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [stats, setStats] = useState<ClickStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      if (!shortCode) return;
      const result = await api.getUrlStats(shortCode);
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to load stats');
      }
      setLoading(false);
    };
    fetchStats();
  }, [shortCode]);

  const data = stats.map(stat => ({
    date: new Date(stat.clicked_at).toLocaleDateString(),
    clicks: 1,
  })).reduce((acc, curr) => {
    const existing = acc.find(item => item.date === curr.date);
    if (existing) {
      existing.clicks += 1;
    } else {
      acc.push(curr);
    }
    return acc;
  }, [] as { date: string; clicks: number }[]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="relative bg-primary dark:bg-dark-primary rounded-2xl shadow-neumorphic dark:shadow-neumorphic-dark p-6 overflow-hidden">
      <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-6">Statistics for {shortCode}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-8 mb-4">Click Details</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-primary dark:bg-dark-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Agent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Referrer</th>
            </tr>
          </thead>
          <tbody className="bg-primary dark:bg-dark-primary divide-y divide-gray-200 dark:divide-gray-700">
            {stats.map((stat, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(stat.clicked_at).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stat.user_agent}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stat.referrer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;