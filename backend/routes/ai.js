const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, requireSubscription } = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// @route   POST /api/ai/chat
// @desc    Chat with AI assistant
// @access  Private
router.post('/chat', auth, [
  body('message').trim().notEmpty(),
  body('context').optional().trim()
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

    const { message, context } = req.body;

    const response = await aiService.chatWithAI(message, context);

    res.json({
      success: true,
      data: {
        response,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing chat message'
    });
  }
});

// @route   POST /api/ai/analyze-clauses
// @desc    Analyze document clauses
// @access  Private
router.post('/analyze-clauses', auth, requireSubscription('pro'), [
  body('documentText').trim().notEmpty()
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

    const { documentText } = req.body;

    const analysis = await aiService.analyzeDocumentClauses(documentText);

    res.json({
      success: true,
      data: { analysis }
    });
  } catch (error) {
    console.error('Clause analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while analyzing clauses'
    });
  }
});

// @route   POST /api/ai/simplify-document
// @desc    Simplify legal document
// @access  Private
router.post('/simplify-document', auth, requireSubscription('pro'), [
  body('documentText').trim().notEmpty()
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

    const { documentText } = req.body;

    const simplified = await aiService.simplifyLegalDocument(documentText);

    res.json({
      success: true,
      data: { simplified }
    });
  } catch (error) {
    console.error('Document simplification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while simplifying document'
    });
  }
});

// @route   POST /api/ai/check-standard-clauses
// @desc    Check standard clauses
// @access  Private
router.post('/check-standard-clauses', auth, requireSubscription('pro'), [
  body('documentText').trim().notEmpty()
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

    const { documentText } = req.body;

    const clauseCheck = await aiService.checkStandardClauses(documentText);

    res.json({
      success: true,
      data: { clauseCheck }
    });
  } catch (error) {
    console.error('Standard clause check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking standard clauses'
    });
  }
});

// @route   POST /api/ai/generate-document
// @desc    Generate legal document
// @access  Private
router.post('/generate-document', auth, requireSubscription('pro'), [
  body('type').isIn(['nda', 'employment', 'privacy', 'terms', 'partnership', 'lease']),
  body('parameters').optional().isObject()
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

    const { type, parameters = {} } = req.body;

    const document = await aiService.generateDocument(type, parameters);

    res.json({
      success: true,
      data: { document }
    });
  } catch (error) {
    console.error('Document generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating document'
    });
  }
});

module.exports = router;
