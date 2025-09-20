const express = require('express');
const { query, validationResult } = require('express-validator');
const LegalTerm = require('../models/LegalTerm');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/glossary
// @desc    Get legal terms with search and filtering
// @access  Public
router.get('/', [
  query('search').optional().trim(),
  query('category').optional().isIn(['contract', 'liability', 'intellectual-property', 'employment', 'corporate', 'litigation', 'general']),
  query('complexity').optional().isIn(['basic', 'intermediate', 'advanced']),
  query('sort').optional().isIn(['alphabetical', 'category', 'complexity']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { 
      search, 
      category, 
      complexity, 
      sort = 'alphabetical',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (category) query.category = category;
    if (complexity) query.complexity = complexity;

    let terms;
    let total;

    if (search) {
      // Text search
      const searchResults = await LegalTerm.searchTerms(search, query);
      terms = searchResults
        .limit(limit * 1)
        .skip((page - 1) * limit);
      total = searchResults.length;
    } else {
      // Regular query
      terms = await LegalTerm.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit);
      total = await LegalTerm.countDocuments(query);
    }

    // Apply sorting
    switch (sort) {
      case 'alphabetical':
        terms = terms.sort({ displayTerm: 1 });
        break;
      case 'category':
        terms = terms.sort({ category: 1, displayTerm: 1 });
        break;
      case 'complexity':
        const complexityOrder = { 'basic': 1, 'intermediate': 2, 'advanced': 3 };
        terms = terms.sort((a, b) => {
          const aOrder = complexityOrder[a.complexity] || 0;
          const bOrder = complexityOrder[b.complexity] || 0;
          return aOrder - bOrder;
        });
        break;
    }

    res.json({
      success: true,
      data: {
        terms,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get glossary terms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching glossary terms'
    });
  }
});

// @route   GET /api/glossary/:id
// @desc    Get single legal term
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const term = await LegalTerm.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!term) {
      return res.status(404).json({
        success: false,
        message: 'Legal term not found'
      });
    }

    // Get related terms
    const relatedTerms = await term.getRelatedTerms();

    res.json({
      success: true,
      data: {
        term,
        relatedTerms
      }
    });
  } catch (error) {
    console.error('Get legal term error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching legal term'
    });
  }
});

// @route   GET /api/glossary/search/:term
// @desc    Search for specific term
// @access  Public
router.get('/search/:term', async (req, res) => {
  try {
    const searchTerm = req.params.term.toLowerCase();
    
    const terms = await LegalTerm.find({
      $or: [
        { term: { $regex: searchTerm, $options: 'i' } },
        { displayTerm: { $regex: searchTerm, $options: 'i' } },
        { synonyms: { $in: [new RegExp(searchTerm, 'i')] } }
      ],
      isActive: true
    }).limit(10);

    res.json({
      success: true,
      data: { terms }
    });
  } catch (error) {
    console.error('Search legal terms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching legal terms'
    });
  }
});

// @route   GET /api/glossary/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await LegalTerm.distinct('category', { isActive: true });
    
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await LegalTerm.countDocuments({ 
          category, 
          isActive: true 
        });
        return { category, count };
      })
    );

    res.json({
      success: true,
      data: { categories: categoryCounts }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @route   GET /api/glossary/random
// @desc    Get random legal terms
// @access  Public
router.get('/random/:count?', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 5;
    
    const terms = await LegalTerm.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: count } }
    ]);

    res.json({
      success: true,
      data: { terms }
    });
  } catch (error) {
    console.error('Get random terms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching random terms'
    });
  }
});

module.exports = router;
