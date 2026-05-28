import React from 'react';
import GlassCard from '../components/GlassCard';
import { Target, Eye, Heart, Users, Shield, Zap } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'Every feature is designed with citizens in mind, making it easy to report and track issues.',
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Full visibility into complaint status and resolution progress for all stakeholders.',
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'Streamlined workflows help administrators resolve issues faster and more effectively.',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Connecting citizens and administrators for better community outcomes.',
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            About SCTS
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Smart Complaint Tracking System - A modern solution for community issue management
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <GlassCard className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To empower citizens with an easy-to-use platform for reporting public issues,
              while providing administrators with powerful tools to efficiently manage and
              resolve complaints. We believe that every voice matters and every issue deserves attention.
            </p>
          </GlassCard>

          <GlassCard className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To create transparent, responsive, and efficient public service systems across
              communities worldwide. We envision a future where every citizen can easily report
              issues and see meaningful progress toward resolution.
            </p>
          </GlassCard>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <GlassCard key={idx} hover className="p-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center mb-4">
                  <value.icon className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {value.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Register', desc: 'Create your free account' },
              { step: '2', title: 'Report', desc: 'Submit your complaint with details' },
              { step: '3', title: 'Track', desc: 'Monitor progress in real-time' },
              { step: '4', title: 'Resolve', desc: 'Get your issue resolved' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
