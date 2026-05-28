import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  ArrowRight,
  Search,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import { Complaint } from '../types';
import GlassCard from '../components/GlassCard';
import CategoryBadge from '../components/CategoryBadge';
import StatusBadge from '../components/StatusBadge';
import { categoryLabels, statusLabels, getImageUrl } from '../types';

export default function UserDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await api.getUserComplaints(user._id);
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
    setLoading(false);
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'pending').length,
    inProgress: complaints.filter((c) => c.status === 'in_progress').length,
    resolved: complaints.filter((c) => c.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              My Complaints
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Track and manage your submitted complaints
            </p>
          </div>
          <Link
            to="/complaint/new"
            className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <PlusCircle className="w-5 h-5" />
            New Complaint
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Total</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pending}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Pending</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.inProgress}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">In Progress</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.resolved}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Resolved</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 outline-none text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 outline-none text-slate-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredComplaints.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No complaints found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {complaints.length === 0
                ? "You haven't submitted any complaints yet."
                : 'No complaints match your search criteria.'}
            </p>
            {complaints.length === 0 && (
              <Link
                to="/complaint/new"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                Submit Your First Complaint
              </Link>
            )}
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <Link key={complaint._id} to={`/complaint/${complaint._id}`}>
                <GlassCard hover className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {complaint.imageUrl && (
                      <div className="w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(complaint.imageUrl)}
                          alt={complaint.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                          {complaint.title}
                        </h3>
                        <StatusBadge status={complaint.status} size="sm" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 line-clamp-2">
                        {complaint.description || 'No description provided'}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <CategoryBadge category={complaint.category} size="sm" />
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {complaint.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 hidden sm:block" />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
