import { Response } from 'express';
import Complaint from '../models/Complaint.js';
import { AuthRequest } from '../middleware/auth.js';

export const getComplaints = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user?._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getComplaintById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
      return;
    }

    if (complaint.createdBy.toString() !== req.user?._id && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this complaint',
      });
      return;
    }

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const createComplaint = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, category, location } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const complaint = await Complaint.create({
      title,
      description: description || '',
      category,
      location,
      imageUrl,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateComplaint = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
      return;
    }

    if (complaint.createdBy.toString() !== req.user?._id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this complaint',
      });
      return;
    }

    const { title, description, category, location } = req.body;
    const updateData: Record<string, unknown> = {};

    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (location) updateData.location = location;
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    complaint = await Complaint.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const deleteComplaint = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
      return;
    }

    if (complaint.createdBy.toString() !== req.user?._id && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this complaint',
      });
      return;
    }

    await complaint.deleteOne();

    res.json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
