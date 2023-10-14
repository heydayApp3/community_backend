const express = require("express");
const {
  // accessChat,
  fetchGroups,
  createGroup,
  // removeFromGroup,
  // addToGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// router.route("/").post(protect, accessChat);
router.route("/fetchGroups").post(protect, fetchGroups);
router.route("/createGroup").post(protect, createGroup);
// router.route("/groupremove").put(protect, removeFromGroup);
// router.route("/groupadd").put(protect, addToGroup);
// router.route("/addAdmin").put(protect, addAdmin)

module.exports = router;