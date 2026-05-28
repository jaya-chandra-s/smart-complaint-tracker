import mongoose, { Document, Schema } from 'mongoose';

export type ComplaintCategory = 'road_damage' | 'water_leakage' | 'garbage_issue' | 'electricity_problem' | 'drainage_problem';
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved';

export interface IComplaint extends Document {
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  imageUrl: string;
  status: ComplaintStatus;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<IComplaint>(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['road_damage', 'water_leakage', 'garbage_issue', 'electricity_problem', 'drainage_problem'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      trim: true,
      maxlength: [200, 'Location cannot be more than 200 characters'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved'],
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
complaintSchema.index({ createdBy: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ createdAt: -1 });

export default mongoose.model<IComplaint>('Complaint', complaintSchema);
