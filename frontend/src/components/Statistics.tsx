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
  const [totalClicks, setTotalClicks] = useState(0);
  const [uniqueClicks, setUniqueClicks] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (!shortCode) return;
      const result = await api.getUrlStats(shortCode);
      if (result.success && result.data) {
        setStats(result.data);
        setTotalClicks(result.data.length);
        const uniqueUserAgents = new Set(result.data.map(stat => stat.user_agent));
        setUniqueClicks(uniqueUserAgents.size);
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
  }, [] as { date: string; clicks: number }[])
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Statistics for {shortCode}</h1>
        <p className="text-base-content/70">Detailed insights into your shortened URL</p>
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

              <div className="lg:col-span-1">

                <div className="grid grid-cols-1 gap-4">

                  <div className="stats shadow bg-base-100">

                    <div className="stat">

                      <div className="stat-figure text-primary">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>

                        </svg>

                      </div>

                      <div className="stat-title">Total Clicks</div>

                      <div className="stat-value text-primary">{totalClicks}</div>

                      <div className="stat-desc">All time clicks</div>

                    </div>

                  </div>

      

                  <div className="stats shadow bg-base-100">

                    <div className="stat">

                      <div className="stat-figure text-secondary">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>

                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>

                        </svg>

                      </div>

                      <div className="stat-title">Unique Clicks</div>

                      <div className="stat-value text-secondary">{uniqueClicks}</div>

                      <div className="stat-desc">Unique visitors</div>

                    </div>

                  </div>

                </div>

              </div>

      

              <div className="lg:col-span-2">

                          <div className="card shadow-lg bg-base-100 p-6 text-primary">

                            <h3 className="text-2xl font-bold mb-4">Click Trend</h3>

                            <ResponsiveContainer width="100%" height={400}>

                              <LineChart data={data}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="date" />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Line type="monotone" dataKey="clicks" stroke="currentColor" activeDot={{ r: 8 }} />

                              </LineChart>

                            </ResponsiveContainer>

                          </div>

              </div>

            </div>

      

            <div className="card shadow-lg bg-base-100 p-6 mt-8">

              <h3 className="text-2xl font-bold mb-4">Click Details</h3>

              <div className="overflow-x-auto">

                <table className="table w-full">

                  <thead>

                    <tr>

                      <th>Date</th>

                      <th>User Agent</th>

                      <th>Referrer</th>

                    </tr>

                  </thead>

                  <tbody>

                    {stats.map((stat, index) => (

                      <tr key={index}>

                        <td>{new Date(stat.clicked_at).toLocaleString()}</td>

                        <td>{stat.user_agent}</td>

                        <td>{stat.referrer}</td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>
    </div>
  );
};

export default Statistics;