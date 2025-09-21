const express = require('express');
const { body, validationResult } = require('express-validator');
const Deadline = require('../models/Deadline');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/deadlines
// @desc    Get user's deadlines
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 10 } = req.query;
    
    const query = { userId: req.user._id };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const deadlines = await Deadline.find(query)
      .sort({ dueDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Deadline.countDocuments(query);

    res.json({
      success: true,
      data: {
        deadlines,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get deadlines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching deadlines'
    });
  }
});

// @route   GET /api/deadlines/:id
// @desc    Get single deadline
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const deadline = await Deadline.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!deadline) {
      return res.status(404).json({
        success: false,
        message: 'Deadline not found'
      });
    }

    res.json({
      success: true,
      data: { deadline }
    });
  } catch (error) {
    console.error('Get deadline error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching deadline'
    });
  }
});

// @route   POST /api/deadlines
// @desc    Create new deadline
// @access  Private
router.post('/', auth, [
  body('title').trim().notEmpty(),
  body('dueDate').isISO8601(),
  body('priority').isIn(['low', 'medium', 'high', 'critical']),
  body('category').isIn(['tax-compliance', 'intellectual-property', 'corporate-governance', 'hr-compliance', 'data-compliance', 'insurance', 'it-compliance', 'vendor-management', 'other'])
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
      title,
      description,
      dueDate,
      priority,
      category,
      assignedTo,
      tags,
      estimatedHours,
      cost
    } = req.body;

    const deadline = new Deadline({
      userId: req.user._id,
      title,
      description,
      dueDate,
      priority,
      category,
      assignedTo,
      tags: tags || [],
      estimatedHours,
      cost
    });

    await deadline.save();

    res.status(201).json({
      success: true,
      message: 'Deadline created successfully',
      data: { deadline }
    });
  } catch (error) {
    console.error('Create deadline error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating deadline'
    });
  }
});

// @route   PUT /api/deadlines/:id
// @desc    Update deadline
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().notEmpty(),
  body('dueDate').optional().isISO8601(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('status').optional().isIn(['upcoming', 'in-progress', 'completed', 'overdue', 'cancelled'])
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

    const deadline = await Deadline.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!deadline) {
      return res.status(404).json({
        success: false,
        message: 'Deadline not found'
      });
    }

    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      tags,
      estimatedHours,
      actualHours,
      cost,
      notes
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate) updateData.dueDate = dueDate;
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (tags) updateData.tags = tags;
    if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours;
    if (actualHours !== undefined) updateData.actualHours = actualHours;
    if (cost !== undefined) updateData.cost = cost;
    if (notes) {
      updateData.notes = [...(deadline.notes || []), {
        content: notes,
        timestamp: new Date(),
        author: req.user.firstName + ' ' + req.user.lastName
      }];
    }

    const updatedDeadline = await Deadline.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Deadline updated successfully',
      data: { deadline: updatedDeadline }
    });
  } catch (error) {
    console.error('Update deadline error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating deadline'
    });
  }
});

// @route   DELETE /api/deadlines/:id
// @desc    Delete deadline
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const deadline = await Deadline.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!deadline) {
      return res.status(404).json({
        success: false,
        message: 'Deadline not found'
      });
    }

    await Deadline.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Deadline deleted successfully'
    });
  } catch (error) {
    console.error('Delete deadline error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting deadline'
    });
  }
});

// @route   GET /api/deadlines/upcoming
// @desc    Get upcoming deadlines
// @access  Private
router.get('/upcoming', auth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const deadlines = await Deadline.find({
      userId: req.user._id,
      status: { $in: ['upcoming', 'in-progress'] }
    })
    .sort({ dueDate: 1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: { deadlines }
    });
  } catch (error) {
    console.error('Get upcoming deadlines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upcoming deadlines'
    });
  }
});

// @route   GET /api/deadlines/overdue
// @desc    Get overdue deadlines
// @access  Private
router.get('/overdue', auth, async (req, res) => {
  try {
    const deadlines = await Deadline.find({
      userId: req.user._id,
      status: 'overdue'
    }).sort({ dueDate: 1 });

    res.json({
      success: true,
      data: { deadlines }
    });
  } catch (error) {
    console.error('Get overdue deadlines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching overdue deadlines'
    });
  }
});

module.exports = router;

