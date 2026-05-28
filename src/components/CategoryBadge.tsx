import React from 'react';
import { ComplantCategory, categoryLabels } from '../types';
import {
  Car,
  Droplets,
  Trash2,
  Zap,
  Droplet,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: ComplantCategory;
  size?: 'sm' | 'md';
}

const categoryConfig: Record<ComplantCategory, { color: string; bgColor: string; icon: React.ElementType }> = {
  road_damage: {
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    icon: Car,
  },
  water_leakage: {
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    icon: Droplets,
  },
  garbage_issue: {
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    icon: Trash2,
  },
  electricity_problem: {
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: Zap,
  },
  drainage_problem: {
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    icon: Droplet,
  },
};

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bgColor} ${config.color} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {categoryLabels[category]}
    </span>
  );
}
