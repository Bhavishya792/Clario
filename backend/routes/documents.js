const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const Document = require('../models/Document');
const { auth, requireSubscription } = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

// @route   GET /api/documents
// @desc    Get user's documents
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, starred, search, page = 1, limit = 10 } = req.query;
    
    const query = { userId: req.user._id };
    
    if (type) query.type = type;
    if (status) query.status = status;
    if (starred !== undefined) query.isStarred = starred === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const documents = await Document.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'firstName lastName email');

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching documents'
    });
  }
});

// @route   GET /api/documents/:id
// @desc    Get single document
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      data: { document }
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching document'
    });
  }
});

// @route   POST /api/documents
// @desc    Create new document
// @access  Private
router.post('/', auth, [
  body('title').trim().notEmpty(),
  body('type').isIn(['contract', 'nda', 'employment', 'privacy', 'terms', 'partnership', 'lease', 'other']),
  body('content').notEmpty()
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

    const { title, type, content, tags = [] } = req.body;

    const document = new Document({
      userId: req.user._id,
      title,
      type,
      content: {
        original: content
      },
      tags,
      metadata: {
        wordCount: content.split(' ').length,
        language: 'en'
      }
    });

    await document.save();

    res.status(201).json({
      success: true,
      message: 'Document created successfully',
      data: { document }
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating document'
    });
  }
});

// @route   POST /api/documents/upload
// @desc    Upload document file
// @access  Private
router.post('/upload', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { title, type, tags } = req.body;
    
    // Read file content (simplified - in production, use proper file parsing)
    const content = await fs.readFile(req.file.path, 'utf8');

    const document = new Document({
      userId: req.user._id,
      title: title || req.file.originalname,
      type: type || 'other',
      content: {
        original: content
      },
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      metadata: {
        wordCount: content.split(' ').length,
        language: 'en'
      }
    });

    await document.save();

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: { document }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading document'
    });
  }
});

// @route   POST /api/documents/:id/analyze
// @desc    Analyze document with AI
// @access  Private
router.post('/:id/analyze', auth, requireSubscription('pro'), async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Analyze document with AI
    const analysis = await aiService.analyzeDocumentClauses(document.content.original);
    
    // Update document with analysis
    document.content.analysis = analysis;
    document.metadata.lastAnalyzed = new Date();
    document.metadata.riskScore = analysis.overallRisk;
    document.status = 'analyzed';
    
    await document.save();

    res.json({
      success: true,
      message: 'Document analyzed successfully',
      data: { analysis }
    });
  } catch (error) {
    console.error('Analyze document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while analyzing document'
    });
  }
});

// @route   POST /api/documents/:id/simplify
// @desc    Simplify document with AI
// @access  Private
router.post('/:id/simplify', auth, requireSubscription('pro'), async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Simplify document with AI
    const simplified = await aiService.simplifyLegalDocument(document.content.original);
    
    // Update document with simplified version
    document.content.simplified = simplified;
    document.metadata.complexityScore = Math.max(0, 100 - (simplified.length / document.content.original.length * 100));
    
    await document.save();

    res.json({
      success: true,
      message: 'Document simplified successfully',
      data: { simplified }
    });
  } catch (error) {
    console.error('Simplify document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while simplifying document'
    });
  }
});

// @route   POST /api/documents/:id/check-clauses
// @desc    Check standard clauses
// @access  Private
router.post('/:id/check-clauses', auth, requireSubscription('pro'), async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check standard clauses with AI
    const clauseCheck = await aiService.checkStandardClauses(document.content.original);
    
    // Update document with clause analysis
    if (!document.content.analysis) {
      document.content.analysis = {};
    }
    document.content.analysis.clauseCheck = clauseCheck;
    document.metadata.lastAnalyzed = new Date();
    
    await document.save();

    res.json({
      success: true,
      message: 'Clause check completed successfully',
      data: { clauseCheck }
    });
  } catch (error) {
    console.error('Check clauses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking clauses'
    });
  }
});

// @route   PUT /api/documents/:id
// @desc    Update document
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().notEmpty(),
  body('type').optional().isIn(['contract', 'nda', 'employment', 'privacy', 'terms', 'partnership', 'lease', 'other']),
  body('content').optional().notEmpty()
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

    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const { title, type, content, tags, isStarred } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (type) updateData.type = type;
    if (content) {
      updateData['content.original'] = content;
      updateData['metadata.wordCount'] = content.split(' ').length;
    }
    if (tags) updateData.tags = tags;
    if (isStarred !== undefined) updateData.isStarred = isStarred;

    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Document updated successfully',
      data: { document: updatedDocument }
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating document'
    });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file if exists
    if (document.filePath) {
      try {
        await fs.unlink(document.filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting document'
    });
  }
});

module.exports = router;
