import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ComplantCategory, categoryLabels, Complaint } from '../types';
import GlassCard from '../components/GlassCard';
import {
  FileText,
  Clock,
  CheckCircle2,
  Loader2,
  TrendingUp,
  ArrowRight,
  BarChart3,
} from 'lucide-react';

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, complaintsData] = await Promise.all([
        api.getStats(),
        api.getComplaints(),
      ]);
      setStats(statsData);
      setRecentComplaints(complaintsData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const statCards = [
    {
      label: 'Total Complaints',
      value: stats.total,
      icon: FileText,
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Loader2,
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage and track all complaints
            </p>
          </div>
          <Link
            to="/admin/analytics"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <BarChart3 className="w-5 h-5" />
            View Analytics
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statCards.map((stat, idx) => (
            <GlassCard key={idx} className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 text-current ${stat.icon === Loader2 ? 'animate-spin' : ''}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {loading ? '...' : stat.value}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Complaints
            </h2>
            <Link
              to="/admin/complaints"
              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : recentComplaints.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">No complaints found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentComplaints.map((complaint) => (
                <Link
                  key={complaint._id}
                  to={`/complaint/${complaint._id}`}
                  className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-white truncate">
                        {complaint.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {categoryLabels[complaint.category]}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                        complaint.status === 'pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : complaint.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
