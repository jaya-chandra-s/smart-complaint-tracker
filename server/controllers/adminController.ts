import { Response } from 'express';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAllComplaints = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, category, search } = req.query;

    let query: Record<string, unknown> = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    let complaints = await Complaint.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      complaints = complaints.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.location.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateComplaintStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    if (!['pending', 'in_progress', 'resolved'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
      return;
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
      return;
    }

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const inProgress = await Complaint.countDocuments({ status: 'in_progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const recentComplaints = await Complaint.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const categoryCount: Record<string, number> = {
      road_damage: 0,
      water_leakage: 0,
      garbage_issue: 0,
      electricity_problem: 0,
      drainage_problem: 0,
    };

    categoryStats.forEach((stat) => {
      categoryCount[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        resolved,
        categoryCount,
        recentComplaints,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getAnalytics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendStats = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const allComplaints = await Complaint.find();
    const total = allComplaints.length;

    res.json({
      success: true,
      data: {
        categoryStats,
        statusStats,
        trendStats,
        total,
        resolved: statusStats.find((s) => s._id === 'resolved')?.count || 0,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
