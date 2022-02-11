const {Schema, model} = require("mongoose")

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