const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, studentId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const issue = new Issue({
      title,
      description,
      category,
      imageUrl,
      studentId,
    });

    await issue.save();
    res.status(201).json({ message: "Issue submitted successfully", issue });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;