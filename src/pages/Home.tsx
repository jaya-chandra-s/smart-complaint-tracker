import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import {
  AlertTriangle,
  BarChart3,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Users,
  FileText,
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: FileText,
      title: 'Easy Reporting',
      description: 'Submit complaints quickly with our intuitive form. Add photos, location, and detailed descriptions.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Track your complaint status from submission to resolution. Stay informed every step of the way.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Admin Management',
      description: 'Administrators can efficiently manage, update, and resolve complaints with powerful tools.',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and insights to identify trends and improve community services.',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const stats = [
    { label: 'Complaints Resolved', value: '10,000+', icon: CheckCircle2 },
    { label: 'Active Users', value: '5,000+', icon: Users },
    { label: 'Response Time', value: '< 48hrs', icon: Clock },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-white/50 to-indigo-500/10 dark:from-blue-500/5 dark:via-slate-900/50 dark:to-indigo-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pb-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              Smart Complaint Tracking System
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Report Issues.
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Improve Your Community.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8">
              A modern platform for citizens to report public issues like road damage,
              water leakage, and garbage problems. Track progress and get results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-8 py-4 text-lg font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <GlassCard key={idx} className="p-6 text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our platform provides all the tools for effective community issue management
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <GlassCard key={idx} hover className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <GlassCard className="p-8 sm:p-12 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Ready to Make a Difference?
                </h2>
                <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                  Join thousands of citizens who are actively improving their communities
                  through our complaint tracking system.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-all shadow-lg"
                >
                  Create Your Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>
      )}
    </div>
  );
}
