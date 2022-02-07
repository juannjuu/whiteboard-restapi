const {Schema, model} = require("mongoose")

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
    teamName : {
        type: String,
        required: true
    },
    members : [userSchema],
    createdAt : {
        type: Date,
        default : Date.now()
    }
})

const Team = model("teams", schema)

module.exports = Team