const mongoose = require('mongoose');

const deadlineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['upcoming', 'in-progress', 'completed', 'overdue', 'cancelled'],
    default: 'upcoming'
  },
  category: {
    type: String,
    enum: ['tax-compliance', 'intellectual-property', 'corporate-governance', 'hr-compliance', 'data-compliance', 'insurance', 'it-compliance', 'vendor-management', 'other'],
    required: true
  },
  assignedTo: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  reminderSettings: {
    enabled: { type: Boolean, default: true },
    daysBefore: [{ type: Number }], // [7, 3, 1] for 7 days, 3 days, 1 day before
    emailReminder: { type: Boolean, default: true },
    pushReminder: { type: Boolean, default: true }
  },
  relatedDocuments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  notes: [{
    content: String,
    timestamp: { type: Date, default: Date.now },
    author: String
  }],
  completionDate: {
    type: Date
  },
  estimatedHours: {
    type: Number
  },
  actualHours: {
    type: Number
  },
  cost: {
    amount: Number,
    currency: { type: String, default: 'USD' }
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annually'] },
    interval: { type: Number, default: 1 },
    endDate: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
deadlineSchema.index({ userId: 1, dueDate: 1 });
deadlineSchema.index({ userId: 1, status: 1 });
deadlineSchema.index({ userId: 1, priority: 1 });
deadlineSchema.index({ userId: 1, category: 1 });

// Virtual for days remaining
deadlineSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to check if deadline is overdue
deadlineSchema.methods.isOverdue = function() {
  return new Date() > this.dueDate && this.status !== 'completed';
};

// Method to update status based on due date
deadlineSchema.methods.updateStatus = function() {
  if (this.status === 'completed' || this.status === 'cancelled') {
    return;
  }
  
  if (this.isOverdue()) {
    this.status = 'overdue';
  } else if (this.daysRemaining <= 0) {
    this.status = 'upcoming';
  }
};

module.exports = mongoose.model('Deadline', deadlineSchema);
