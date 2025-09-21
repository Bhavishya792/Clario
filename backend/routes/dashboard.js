const express = require('express');
const Document = require('../models/Document');
const Deadline = require('../models/Deadline');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get document count
    const documentCount = await Document.countDocuments({ userId });

    // Get deadline counts
    const totalDeadlines = await Deadline.countDocuments({ userId });
    const upcomingDeadlines = await Deadline.countDocuments({ 
      userId, 
      status: { $in: ['upcoming', 'in-progress'] } 
    });
    const overdueDeadlines = await Deadline.countDocuments({ 
      userId, 
      status: 'overdue' 
    });
    const highPriorityDeadlines = await Deadline.countDocuments({ 
      userId, 
      priority: { $in: ['high', 'critical'] } 
    });

    // Calculate compliance score (mock calculation)
    const completedDeadlines = await Deadline.countDocuments({ 
      userId, 
      status: 'completed' 
    });
    const complianceScore = totalDeadlines > 0 ? Math.round((completedDeadlines / totalDeadlines) * 100) : 100;

    // Get recent documents
    const recentDocuments = await Document.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title type updatedAt');

    // Get upcoming deadlines
    const upcomingDeadlinesList = await Deadline.find({
      userId,
      status: { $in: ['upcoming', 'in-progress'] }
    })
    .sort({ dueDate: 1 })
    .limit(5)
    .select('title dueDate priority status');

    res.json({
      success: true,
      data: {
        stats: {
          documents: documentCount,
          deadlines: totalDeadlines,
          upcoming: upcomingDeadlines,
          overdue: overdueDeadlines,
          highPriority: highPriorityDeadlines,
          compliance: complianceScore
        },
        recentDocuments,
        upcomingDeadlines: upcomingDeadlinesList
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// @route   GET /api/dashboard/health-check
// @desc    Generate legal health checkup
// @access  Private
router.get('/health-check', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Analyze user's legal health
    const overdueDeadlines = await Deadline.countDocuments({ 
      userId, 
      status: 'overdue' 
    });
    const highPriorityDeadlines = await Deadline.countDocuments({ 
      userId, 
      priority: { $in: ['high', 'critical'] } 
    });
    const totalDeadlines = await Deadline.countDocuments({ userId });
    const documentCount = await Document.countDocuments({ userId });

    // Calculate risk score
    let riskScore = 100;
    
    if (overdueDeadlines > 0) {
      riskScore -= (overdueDeadlines * 20);
    }
    
    if (highPriorityDeadlines > 0) {
      riskScore -= (highPriorityDeadlines * 10);
    }
    
    if (totalDeadlines === 0) {
      riskScore -= 30; // No deadlines tracked
    }
    
    if (documentCount === 0) {
      riskScore -= 20; // No documents uploaded
    }

    riskScore = Math.max(0, riskScore);

    // Generate recommendations
    const recommendations = [];
    
    if (overdueDeadlines > 0) {
      recommendations.push({
        type: 'urgent',
        title: 'Address Overdue Deadlines',
        description: `You have ${overdueDeadlines} overdue deadline(s) that require immediate attention.`
      });
    }
    
    if (highPriorityDeadlines > 0) {
      recommendations.push({
        type: 'high',
        title: 'High Priority Deadlines',
        description: `You have ${highPriorityDeadlines} high-priority deadline(s) approaching.`
      });
    }
    
    if (totalDeadlines === 0) {
      recommendations.push({
        type: 'medium',
        title: 'Start Tracking Deadlines',
        description: 'Begin tracking your legal deadlines to maintain compliance.'
      });
    }
    
    if (documentCount === 0) {
      recommendations.push({
        type: 'medium',
        title: 'Upload Legal Documents',
        description: 'Upload your legal documents for analysis and management.'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        title: 'Excellent Legal Health',
        description: 'Your legal compliance is in good standing!'
      });
    }

    res.json({
      success: true,
      data: {
        riskScore,
        recommendations,
        summary: {
          overdueDeadlines,
          highPriorityDeadlines,
          totalDeadlines,
          documentCount
        }
      }
    });
  } catch (error) {
    console.error('Generate health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating health checkup'
    });
  }
});

module.exports = router;

