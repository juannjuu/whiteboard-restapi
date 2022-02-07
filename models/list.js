const { Schema, model } = require("mongoose")

const schema = new Schema({
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'boards',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        default : Date.now()
    }
})

const List = model("lists", schema)

module.exports = List