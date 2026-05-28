export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: ComplantCategory;
  location: string;
  imageUrl: string;
  status: ComplaintStatus;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export type ComplantCategory = 'road_damage' | 'water_leakage' | 'garbage_issue' | 'electricity_problem' | 'drainage_problem';
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';
export type UserRole = 'user' | 'admin';

export const categoryLabels: Record<ComplantCategory, string> = {
  road_damage: 'Road Damage',
  water_leakage: 'Water Leakage',
  garbage_issue: 'Garbage Issue',
  electricity_problem: 'Electricity Problem',
  drainage_problem: 'Drainage Problem',
};

export const statusLabels: Record<ComplaintStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_URL.replace('/api', '')}${imageUrl}`;
};
