const { Schema, model } = require("mongoose");

const schema = new Schema({
    board : {
        type : Schema.Types.ObjectId,
        ref : "boards",
        required: true
    },
    sender : {
        type : Schema.Types.ObjectId,
        ref : "users",
        required: true
    },
    invited : {
        type : Schema.Types.ObjectId,
        ref : "users",
        required: true
    },
    isAccepted : {
        type: Boolean,
        required: true,
    },
});

const Invitation = model("invitations", schema);

module.exports = Invitation;