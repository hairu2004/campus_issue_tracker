const Issue = require('../models/Issue');

// Create a new issue
const createIssue = async (req, res) => {
  try {
    const { title, description, category, lat, lng } = req.body;
    const imageUrl = req.file ? req.file.filename : null;

    const issue = new Issue({
      title,
      description,
      category,
      imageUrl,
      studentId: req.user.userId,
      status: 'pending',
      notified: false,
      location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined // ✅ FIXED
    });

    await issue.save();
    res.status(201).json({ message: 'Issue reported successfully', issue });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all issues (for admin or student)
const getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = req.user.role === 'admin'
      ? {}
      : { studentId: req.user.userId };

    const total = await Issue.countDocuments(filter);
    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      issues,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update issue status
const updateIssueStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = req.body.status || issue.status;

    if (req.body.status === "resolved") {
      issue.notified = false;
    }

    if (req.body.notified !== undefined) {
      issue.notified = req.body.notified;
    }

    await issue.save();
    res.status(200).json({ message: 'Issue updated', issue });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get analytics stats
const getIssueStats = async (req, res) => {
  try {
    const categoryStats = await Issue.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const statusStats = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const monthlyStats = await Issue.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({ categoryStats, statusStats, monthlyStats });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};

module.exports = {
  createIssue,
  getIssues,
  updateIssueStatus,
  getIssueStats
};