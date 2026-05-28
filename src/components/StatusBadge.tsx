import React from 'react';
import { ComplaintStatus, statusLabels } from '../types';
import { Clock, Loader2, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<ComplaintStatus, { color: string; bgColor: string; dotColor: string; icon: React.ElementType }> = {
  pending: {
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    dotColor: 'bg-amber-500',
    icon: Clock,
  },
  in_progress: {
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    dotColor: 'bg-blue-500',
    icon: Loader2,
  },
  resolved: {
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    dotColor: 'bg-green-500',
    icon: CheckCircle2,
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeClasses}`}
    >
      <Icon className={`w-4 h-4 ${status === 'in_progress' ? 'animate-spin' : ''}`} />
      {statusLabels[status]}
    </span>
  );
}
