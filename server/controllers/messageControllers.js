const asyncHandler = require("express-async-handler");;
const User = require("../models/userModel");
const Group=require("../models/group")
const Message=require('../models/messageModel')

const sendMessages=asyncHandler(async (req, res) => {
    try {
      const { content, chatId, readBy } = req.body;
  
      // Create a new message object
      const newMessage = new Message({
        sender:req.user._id,
        content:content,
        chatId:chatId,
        readBy:readBy,
      });
  
      // Save the message to the database
      const savedMessage = await newMessage.save();

      await Group.findByIdAndUpdate(chatId, { latestMessage: savedMessage._id });
      
      await savedMessage.populate("sender");
  
      res.json(savedMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const fetchMessages=asyncHandler( async (req, res) => {
    try {
      const chatId = req.params.chatId;
  
      // Find all messages of the specified chat and sort them in descending order of creation
      const messages = await Message.find({ chatId: chatId })
        .sort({ createdAt: 1 })
        .populate("sender")
        .exec();
  
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
module.exports = {
    sendMessages,
    fetchMessages
  };