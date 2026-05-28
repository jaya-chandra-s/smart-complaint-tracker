import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ComplantCategory, ComplaintStatus, categoryLabels, statusLabels, getImageUrl } from '../types';
import GlassCard from '../components/GlassCard';
import CategoryBadge from '../components/CategoryBadge';
import StatusBadge from '../components/StatusBadge';
import {
  Search,
  Filter,
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Complaint } from '../types';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (searchTerm) params.append('search', searchTerm);

      const data = await api.get<Complaint[]>(`/admin/complaints?${params.toString()}`);
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (complaintId: string, status: ComplaintStatus) => {
    try {
      await api.put(`/admin/complaints/${complaintId}/status`, { status });
      toast.success('Status updated successfully');
      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? { ...c, status } : c))
      );
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (complaintId: string) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await api.delete(`/complaints/${complaintId}`);
      toast.success('Complaint deleted successfully');
      setComplaints((prev) => prev.filter((c) => c._id !== complaintId));
    } catch (error) {
      toast.error('Failed to delete complaint');
    }
  };

  const handleSearch = () => {
    fetchComplaints();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            All Complaints
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and update complaint statuses
          </p>
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); fetchComplaints(); }}
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
                onChange={(e) => { setCategoryFilter(e.target.value); fetchComplaints(); }}
                className="px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 outline-none text-slate-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <button
                onClick={handleSearch}
                className="px-6 py-3 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </GlassCard>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : complaints.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No complaints found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              No complaints match your search criteria.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <GlassCard key={complaint._id} className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {complaint.imageUrl && (
                    <div className="w-full lg:w-32 h-32 lg:h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(complaint.imageUrl)}
                        alt={complaint.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <Link
                        to={`/complaint/${complaint._id}`}
                        className="text-lg font-semibold text-slate-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      >
                        {complaint.title}
                      </Link>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <CategoryBadge category={complaint.category} size="sm" />
                        <StatusBadge status={complaint.status} size="sm" />
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                      {complaint.description || 'No description provided'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
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

                  <div className="flex lg:flex-col gap-2 flex-shrink-0">
                    <Link
                      to={`/complaint/${complaint._id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      View
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(complaint._id, 'in_progress')}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <Clock className="w-3 h-3" />
                        Progress
                      </button>
                      <button
                        onClick={() => handleStatusChange(complaint._id, 'resolved')}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Resolve
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(complaint._id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
