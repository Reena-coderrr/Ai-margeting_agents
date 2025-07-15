const express = require("express");
const router = express.Router();

// Example: Get current subscription info
router.get("/", (req, res) => {
  res.json({ message: "Subscription endpoint placeholder" });
});

module.exports = router; 