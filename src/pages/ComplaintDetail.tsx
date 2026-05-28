import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { ComplaintStatus, getImageUrl } from '../types';
import GlassCard from '../components/GlassCard';
import CategoryBadge from '../components/CategoryBadge';
import StatusBadge from '../components/StatusBadge';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Complaint } from '../types';

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    if (!id) return;

    try {
      const data = await api.get<Complaint>(`/complaints/${id}`);
      setComplaint(data);
    } catch (error) {
      toast.error('Failed to load complaint');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!complaint || !confirm('Are you sure you want to delete this complaint?')) return;

    setDeleting(true);
    try {
      await api.delete(`/complaints/${complaint._id}`);
      toast.success('Complaint deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete complaint');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'resolved':
        return 'bg-green-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to={user?.role === 'admin' ? '/admin/complaints' : '/dashboard'}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {user?.role === 'admin' ? 'All Complaints' : 'My Complaints'}
        </Link>

        <GlassCard className="overflow-hidden">
          {complaint.imageUrl && (
            <div className="w-full h-64 sm:h-80 overflow-hidden">
              <img
                src={getImageUrl(complaint.imageUrl)}
                alt={complaint.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  {complaint.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <CategoryBadge category={complaint.category} />
                  <StatusBadge status={complaint.status} />
                </div>
              </div>
              {user?.role !== 'admin' && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              )}
            </div>

            <div className="mb-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                Status Progress
              </h3>
              <div className="flex items-center justify-between">
                {(['pending', 'in_progress', 'resolved'] as ComplaintStatus[]).map((status, idx, arr) => (
                  <div key={status} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          complaint.status === status
                            ? getStatusColor(status)
                            : arr.indexOf(complaint.status) > idx
                            ? 'bg-green-500'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs mt-2 text-slate-600 dark:text-slate-400">
                        {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div
                        className={`w-12 sm:w-24 h-1 mx-2 rounded ${
                          arr.indexOf(complaint.status) > idx
                            ? 'bg-green-500'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {complaint.description || 'No description provided'}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Location
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{complaint.location}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Created
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {format(new Date(complaint.createdAt), 'PPp')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Last Updated
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {format(new Date(complaint.updatedAt), 'PPp')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
