const {Schema, model} = require("mongoose")

const teamMember = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    }
})

const schema = new Schema({
    teamName : {
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        default : Date.now()
    },
    members: [teamMember]
})

const Team = model("teams", schema)

module.exports = Team