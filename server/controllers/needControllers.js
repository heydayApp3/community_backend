const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const Class = require("../models/classModel")
const Group=require("../models/group")
const groupAssignment=require("../models/groupassignment");


const createClass = asyncHandler( async (req, res) => {
  try {
    const { className} = req.body;

    var users = JSON.parse(req.body.users);

    // Create a new class
    const newClass = await Class.create({ className, users });

    // Create a new group
    const newClassGroup = await Group.create({
      groupName:`${className} `,
      users: newClass.users,
      isClassGroup: true,
      isMessagingGroup: true
    });
    
    const newAnnouncementGroup = await Group.create({
      groupName:`${className} Announcement Group`,
      users: newClass.users,
      isAnnouncementGroup: true,
      isClassGroup: true,
    });

    // Update the class with the group's ID
    newClass.classGroupId = newClassGroup._id;
    await newClass.save();

    res.status(201).json({ message: "Class and group created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



const fetchClass = asyncHandler(async (req, res) => {
  try {
    const classId = req.body.clasId;

    // Find the class by ID
    const foundClass = await Class.findById(classId).populate("users");

    if (!foundClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.json(foundClass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

const createGroupAssignment=asyncHandler(  async (req, res) => {
  try {
    const { groups } = req.body;

    // Create a new groupAssignment object
    const newGroupAssignment = new groupAssignment({ groups });

    // Save the groupAssignment to the database
    const savedGroupAssignment = await newGroupAssignment.save();

    // Create groups for each object in the groups array
    const createdGroups = await Promise.all(
      groups.map(async (group) => {
        const { groupNumber, students } = group;

        // Create a new group object
        const newGroup = new Group({
          groupName: `Group ${groupNumber}`,
          users: students,
          isGroupAssignmentGroup: true,
        });

        // Save the group to the database
        const savedGroup = await newGroup.save();

        return savedGroup;
      })
    );

    res.status(201).json({
      groupAssignment: savedGroupAssignment,
      createdGroups,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const fetchgroups = asyncHandler(async (req, res) => {
  try {
    const classId = req.body.classId;

    // Find all classes where the user is present, isElective is true, and exclude the specified classId
    const classes = await Class.find({
      users: req.user._id,
      isElective: true,
      _id: { $ne: classId },
    });

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = { createClass, fetchClass,createGroupAssignment}