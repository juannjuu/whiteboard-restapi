const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    profileId: {
        type: Schema.Types.ObjectId,
        ref: 'profiles',
    }
})

const schema = new Schema({
    teamId : { 
        type: Schema.Types.ObjectId,
        ref: "teams",
        required: true
    },
    title : {
        type: String,
        required: true
    },
    members : [userSchema],
    label : {
        type: Array,
        default: ["UI/UX", "Development", "Design"]
    },
    createdAt : {
        type: Date,
        default : Date.now()
    },
})

const Board = model("boards", schema)

module.exports = Board