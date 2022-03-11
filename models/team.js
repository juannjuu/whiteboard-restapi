const {Schema, model} = require("mongoose")

const teamMember = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    }
})

const boardSchema = new Schema({
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'boards',
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
    members: [teamMember],
    boards: [boardSchema]
})

const Team = model("teams", schema)

module.exports = Team