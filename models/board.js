const { Schema, model } = require("mongoose")

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
    createdAt : {
        type: Date,
        default : Date.now()
    }
})

const Board = model("boards", schema)

module.exports = Board