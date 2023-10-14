const express = require("express");
const {
  createClass,
  fetchClass,
  createGroupAssignment
} = require("../controllers/needControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/createClass").post(protect, createClass);
router.route("/fetchClasses").get(protect,fetchClass)
router.route("/createGroupAssignment").post(protect,createGroupAssignment)

module.exports = router;