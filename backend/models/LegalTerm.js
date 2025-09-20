const mongoose = require('mongoose');

const legalTermSchema = new mongoose.Schema({
  term: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  displayTerm: {
    type: String,
    required: true,
    trim: true
  },
  definition: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['contract', 'liability', 'intellectual-property', 'employment', 'corporate', 'litigation', 'general'],
    required: true
  },
  complexity: {
    type: String,
    enum: ['basic', 'intermediate', 'advanced'],
    default: 'basic'
  },
  examples: [{
    type: String
  }],
  relatedTerms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LegalTerm'
  }],
  synonyms: [{
    type: String,
    trim: true
  }],
  antonyms: [{
    type: String,
    trim: true
  }],
  usage: {
    frequency: { type: String, enum: ['common', 'uncommon', 'rare'], default: 'common' },
    contexts: [{ type: String }]
  },
  legalReferences: [{
    source: String,
    url: String,
    description: String
  }],
  translations: [{
    language: String,
    translation: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search functionality
legalTermSchema.index({ term: 'text', displayTerm: 'text', definition: 'text' });
legalTermSchema.index({ category: 1 });
legalTermSchema.index({ complexity: 1 });
legalTermSchema.index({ isActive: 1 });

// Method to get related terms
legalTermSchema.methods.getRelatedTerms = async function() {
  return await this.constructor.find({
    _id: { $in: this.relatedTerms },
    isActive: true
  }).select('displayTerm definition category complexity');
};

// Static method to search terms
legalTermSchema.statics.searchTerms = function(query, filters = {}) {
  const searchQuery = {
    isActive: true,
    ...filters
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('LegalTerm', legalTermSchema);
