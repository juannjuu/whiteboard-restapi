const { Schema, model } = require("mongoose");

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default : Date.now()
    },
    profileId : {
        type : Schema.Types.ObjectId,
        ref : "profiles",
        required: true
    }
})

const User = model("users", schema);

module.exports = User;