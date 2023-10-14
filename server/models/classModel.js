const mongoose = require("mongoose");

const classSchema = mongoose.Schema(
  {
    className: {
        type:String,
    },
    users: {
        type:[mongoose.Schema.Types.ObjectId],
        ref: "user"
    },
  },
  { timestaps: true }
);

const Class = mongoose.model("class", classSchema);

module.exports = Class;