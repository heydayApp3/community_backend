const mongoose = require("mongoose");

const groupAssignmentSchema = mongoose.Schema(

    {

        groups:[{
            groupNumber: { type: "String"},
            students:{type:[mongoose.Schema.Types.ObjectId],ref:"user"},
        }]

    })

const groupAssignment = mongoose.model("groupAssignment", groupAssignmentSchema);

module.exports = groupAssignment;
