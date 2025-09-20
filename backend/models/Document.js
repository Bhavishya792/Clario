const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['contract', 'nda', 'employment', 'privacy', 'terms', 'partnership', 'lease', 'other'],
    required: true
  },
  content: {
    original: {
      type: String,
      required: true
    },
    simplified: {
      type: String
    },
    analysis: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  filePath: {
    type: String
  },
  fileName: {
    type: String
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'analyzed', 'reviewed', 'approved'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isStarred: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  metadata: {
    wordCount: Number,
    pageCount: Number,
    language: { type: String, default: 'en' },
    lastAnalyzed: Date,
    riskScore: Number,
    complexityScore: Number
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    content: String,
    timestamp: { type: Date, default: Date.now },
    changes: String
  }]
}, {
  timestamps: true
});

// Index for better search performance
documentSchema.index({ userId: 1, title: 'text', tags: 'text' });
documentSchema.index({ userId: 1, type: 1 });
documentSchema.index({ userId: 1, isStarred: 1 });

module.exports = mongoose.model('Document', documentSchema);
