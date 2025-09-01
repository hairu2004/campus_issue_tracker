const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');
const Issue = require('../models/Issue');

const {
  createIssue,
  getIssues,
  updateIssueStatus,
  getIssueStats
} = require('../controllers/issueController');

// Create a new issue with image upload
router.post('/', protect, upload.single('image'), createIssue);

// Get all issues (admin or student)
router.get('/', protect, getIssues);

// Update issue status
router.patch('/:id', protect, updateIssueStatus);

// Get analytics stats
router.get('/stats', protect, getIssueStats);

// Admin edit issue
router.patch('/edit/:id', protect, async (req, res) => {
  try {
    const allowedCategories = ["infrastructure", "academics", "hostel"];
    const { title, description, category } = req.body;

    if (!title || !description || !allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const updated = await Issue.findByIdAndUpdate(req.params.id, {
      title,
      description,
      category
    }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ message: "Issue updated", issue: updated });
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ message: "Failed to update issue", error: err.message });
  }
});

// Admin delete issue
router.delete('/:id', protect, async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete issue", error: err.message });
  }
});

// ✅ Student edit their own issue
router.patch('/student/edit/:id', protect, async (req, res) => {
  try {
    const issue = await Issue.findOne({ _id: req.params.id, studentId: req.user.userId });
    if (!issue) return res.status(404).json({ message: "Issue not found or unauthorized" });

    const { title, description, category } = req.body;
    issue.title = title || issue.title;
    issue.description = description || issue.description;
    issue.category = category || issue.category;

    await issue.save();
    res.status(200).json({ message: "Issue updated", issue });
  } catch (err) {
    res.status(500).json({ message: "Failed to update issue", error: err.message });
  }
});

// ✅ Student delete their own issue
router.delete('/student/:id', protect, async (req, res) => {
  try {
    const issue = await Issue.findOneAndDelete({ _id: req.params.id, studentId: req.user.userId });
    if (!issue) return res.status(404).json({ message: "Issue not found or unauthorized" });

    res.status(200).json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete issue", error: err.message });
  }
});

module.exports = router;