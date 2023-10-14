const mongoose = require("mongoose");

const GroupSchema = mongoose.Schema(
  {

    groupName:{type:String},
    groupDescription:{type:String},
    classId:{type: mongoose.Schema.Types.ObjectId,ref: "class",},
    users:{ type:[mongoose.Schema.Types.ObjectId],ref: "user"},
    latestMessage: {type: mongoose.Schema.Types.ObjectId,ref: "message",},
    groupAdmins: { type:[mongoose.Schema.Types.ObjectId],ref:"user"},

    /*-------------------------------------------*/

    isAnnouncementGroup:{type:Boolean,default:false},
    isMessagingGroup:{type:Boolean,default:false},
    classGroupId:{type: mongoose.Schema.Types.ObjectId,ref: "group"},

    /*-------------------------------------------*/

    isElectiveGroup:{type:Boolean,default:false},

    /*-------------------------------------------*/

    isGroupAssignmentGroup:{type:Boolean,default:false},//assignment id

    /*-------------------------------------------*/

    isClassGroup:{type:Boolean,default:false},

    /*-------------------------------------------*/

    isClubGroup:{type:Boolean,default:false},
    isSubClubGroup:{type: mongoose.Schema.Types.ObjectId,ref: "group"},

    /*-------------------------------------------*/

    isLearningGroup:{type:Boolean,default:false}

    

  },
  
  { timestaps: true }
);

const Group = mongoose.model("group", GroupSchema);

module.exports = Group;
