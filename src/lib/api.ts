import { supabase } from './supabase';
import { Complaint, DashboardStats } from '../types';

export const api = {
  // Complaints
  async getComplaints(filters?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<Complaint[]> {
    let query = supabase
      .from('complaints')
      .select('*, profiles:created_by(name, email)')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return (data || []).map((item) => ({
      _id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category,
      location: item.location,
      imageUrl: item.image_url || '',
      status: item.status,
      createdBy: item.profiles?.[0] || { name: 'Unknown', email: '' },
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  },

  async getUserComplaints(userId: string): Promise<Complaint[]> {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((item) => ({
      _id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category,
      location: item.location,
      imageUrl: item.image_url || '',
      status: item.status,
      createdBy: item.created_by,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  },

  async getComplaint(id: string): Promise<Complaint | null> {
    const { data, error } = await supabase
      .from('complaints')
      .select('*, profiles:created_by(name, email)')
      .eq('id', id)
      .single();

    if (error) return null;

    return {
      _id: data.id,
      title: data.title,
      description: data.description || '',
      category: data.category,
      location: data.location,
      imageUrl: data.image_url || '',
      status: data.status,
      createdBy: data.profiles?.[0] || { name: 'Unknown', email: '' },
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createComplaint(complaint: {
    title: string;
    description: string;
    category: string;
    location: string;
    image_url?: string;
  }): Promise<Complaint> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        ...complaint,
        created_by: user.id,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      _id: data.id,
      title: data.title,
      description: data.description || '',
      category: data.category,
      location: data.location,
      imageUrl: data.image_url || '',
      status: data.status,
      createdBy: user.id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async updateComplaint(id: string, complaint: Partial<{
    title: string;
    description: string;
    category: string;
    location: string;
    image_url: string;
  }>): Promise<Complaint> {
    const { data, error } = await supabase
      .from('complaints')
      .update(complaint)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      _id: data.id,
      title: data.title,
      description: data.description || '',
      category: data.category,
      location: data.location,
      imageUrl: data.image_url || '',
      status: data.status,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async deleteComplaint(id: string): Promise<void> {
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  // Admin
  async updateComplaintStatus(id: string, status: string): Promise<Complaint> {
    const { data, error } = await supabase
      .from('complaints')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      _id: data.id,
      title: data.title,
      description: data.description || '',
      category: data.category,
      location: data.location,
      imageUrl: data.image_url || '',
      status: data.status,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async getStats(): Promise<DashboardStats> {
    const { count: total } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true });

    const { count: pending } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: inProgress } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'in_progress');

    const { count: resolved } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolved');

    return {
      total: total || 0,
      pending: pending || 0,
      inProgress: inProgress || 0,
      resolved: resolved || 0,
    };
  },

  async getAnalytics(): Promise<{
    categoryStats: Array<{ _id: string; count: number }>;
    statusStats: Array<{ _id: string; count: number }>;
    trendStats: Array<{ _id: string; count: number }>;
    total: number;
    resolved: number;
  }> {
    // Get category stats
    const { data: categoryData } = await supabase
      .rpc('get_category_stats');

    // Get status stats
    const { data: statusData } = await supabase
      .rpc('get_status_stats');

    // Get trend stats (last 30 days)
    const { data: trendData } = await supabase
      .rpc('get_trend_stats');

    const { count: total } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true });

    const { count: resolved } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'resolved');

    return {
      categoryStats: categoryData || [],
      statusStats: statusData || [],
      trendStats: trendData || [],
      total: total || 0,
      resolved: resolved || 0,
    };
  },

  // Image upload
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `complaints/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};
