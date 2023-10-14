const express = require("express");
const {
  fetchMessages,
  sendMessages,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// router.route("/").post(protect, accessChat);
router.route("/:chatId").get(protect, fetchMessages);
router.route("/").post(protect, sendMessages);
// router.route("/groupremove").put(protect, removeFromGroup);
// router.route("/groupadd").put(protect, addToGroup);

module.exports = router;