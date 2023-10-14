const asyncHandler = require("express-async-handler");;
const User = require("../models/userModel");
const Group=require("../models/group")
const GroupAssignment=require('../models/groupassignment')

const createGroup = asyncHandler( async (req, res) => {
  try {
    const { groupName,
      groupDescription,
      classId,
      users,
      isAnnouncementGroup,
      isMessagingGroup,
      classGroupId,
      isElectiveGroup,
      isGroupAssignmentGroup,
      isClassGroup,} = req.body;

    var users = JSON.parse(req.body.users);


    // Create a new group document
    const group = new Group({
      groupName,
      classId,
      users,
     // groupAdmins,
      isAnnouncementGroup,
      isMessagingGroup,
      classGroupId,
      isElectiveGroup,
      isGroupAssignmentGroup,
      isClassGroup,
    });

    // Save the group to the database
    await group.save();

    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create group" });
  }
})

const fetchGroups=asyncHandler( async (req, res) => {
  
    const { isAnnouncementGroup, isMessagingGroup, isElectiveGroup, isGroupAssignmentGroup, isClassGroup,classId} = req.body;

  try {
    const group = await Group.find({
      users: req.user._id,
      isAnnouncementGroup: isAnnouncementGroup === true,
      isMessagingGroup: isMessagingGroup === true,
      isElectiveGroup: isElectiveGroup === true,
      isGroupAssignmentGroup: isGroupAssignmentGroup === true,
     isClassGroup: isClassGroup === true
    }).populate({
      path: "users",
      model: "user"
    })
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        model: "user"
      }
    })
    .populate("groupAdmins");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

const createAssignmentGroup=asyncHandler(async (req, res) => {
  const { groupNumber, students } = req.body;

  try {
    // Create group assignment
    const groupAssignment = new GroupAssignment({
      groups: [{ groupNumber, students }]
    });
    const savedGroupAssignment = await groupAssignment.save();

    // Create corresponding group
    const group = new Group({
      users: students,
      isGroupAssignmentGroup: true
    });
    const savedGroup = await group.save();

    res.status(201).json({ groupAssignment: savedGroupAssignment, group: savedGroup });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});







  
module.exports = {
    createAssignmentGroup,
    fetchGroups,
    createGroup,
    // removeFromGroup,
    // addToGroup
  };