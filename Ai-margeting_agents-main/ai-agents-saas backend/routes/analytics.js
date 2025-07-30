const express = require("express");
const AIToolUsage = require("../models/AIToolUsage");
const router = express.Router();

// Get analytics data
router.get("/", async (req, res) => {
  try {
    const totalGenerations = await AIToolUsage.countDocuments();
    const mostPopularTools = await AIToolUsage.aggregate([
      { $group: { _id: "$toolName", uses: { $sum: 1 } } },
      { $sort: { uses: -1 } },
      { $limit: 5 },
      { $project: { name: "$_id", uses: 1, _id: 0 } },
    ]);
    res.json({
      totalGenerations,
      uptime: 98.5, // Dummy value, replace with real if available
      avgResponseTime: 2.3, // Dummy value, replace with real if available
      mostPopularTools,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error });
  }
});

module.exports = router; 