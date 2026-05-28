import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { ComplantCategory, categoryLabels } from '../types';
import GlassCard from '../components/GlassCard';
import {
  Upload,
  MapPin,
  FileText,
  Loader2,
  Camera,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewComplaint() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as ComplantCategory | '',
    location: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (!user) {
      toast.error('You must be signed in to submit a complaint');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';

      if (imageFile) {
        imageUrl = await api.uploadImage(imageFile);
      }

      await api.createComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        image_url: imageUrl,
      });

      toast.success('Complaint submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Submit New Complaint
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Report a public issue in your area
          </p>
        </div>

        <GlassCard className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Complaint Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white"
                  placeholder="Brief title for your complaint"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.keys(categoryLabels) as ComplantCategory[]).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFormData({ ...formData, category })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.category === category
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        formData.category === category
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {categoryLabels[category]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white"
                  placeholder="e.g., Main Street, Near City Park"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-white resize-none"
                placeholder="Provide details about the issue..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Photo (Optional)
              </label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 transition-colors bg-white/30 dark:bg-slate-800/30">
                    <Camera className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Max 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.category}
              className="w-full px-6 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit Complaint
                </>
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
