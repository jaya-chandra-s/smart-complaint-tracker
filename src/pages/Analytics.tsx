import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { api } from '../lib/api';
import { ComplantCategory, categoryLabels } from '../types';
import GlassCard from '../components/GlassCard';
import { BarChart3, Loader2, TrendingUp, Calendar } from 'lucide-react';

interface AnalyticsData {
  categoryStats: Array<{ _id: string; count: number }>;
  statusStats: Array<{ _id: string; count: number }>;
  trendStats: Array<{ _id: string; count: number }>;
  total: number;
  resolved: number;
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [trendData, setTrendData] = useState<{ date: string; complaints: number }[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const analyticsData = await api.get<AnalyticsData>('/admin/analytics');
      setData(analyticsData);

      const catData = analyticsData.categoryStats.map((stat) => ({
        name: categoryLabels[stat._id as ComplantCategory] || stat._id,
        value: stat.count,
      }));
      setCategoryData(catData);

      const statData = analyticsData.statusStats.map((stat) => ({
        name: stat._id === 'in_progress' ? 'In Progress' : stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
        value: stat.count,
      }));
      setStatusData(statData);

      const trend = analyticsData.trendStats.map((stat) => ({
        date: new Date(stat._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        complaints: stat.count,
      }));
      setTrendData(trend);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const resolutionRate = data && data.total > 0
    ? ((data.resolved / data.total) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Insights and statistics on complaints
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Complaints by Category
              </h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="value" fill="#2563EB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Status Distribution
              </h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === 'Pending'
                            ? '#F59E0B'
                            : entry.name === 'In Progress'
                            ? '#2563EB'
                            : '#16A34A'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Complaints Trend (Last 30 Days)
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="complaints"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="New Complaints"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            {
              label: 'Total Complaints',
              value: data?.total || 0,
              color: 'border-blue-500',
            },
            {
              label: 'Resolved',
              value: data?.resolved || 0,
              color: 'border-green-500',
            },
            {
              label: 'Resolution Rate',
              value: `${resolutionRate}%`,
              color: 'border-amber-500',
            },
          ].map((stat, idx) => (
            <GlassCard
              key={idx}
              className={`p-4 border-l-4 ${stat.color}`}
            >
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
