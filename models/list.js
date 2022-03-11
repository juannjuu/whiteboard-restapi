const { Schema, model } = require("mongoose")

const cardSchema = new Schema({
    cardId: {
        type: Schema.Types.ObjectId,
        ref: 'cards',
    }
})

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
    cards: [cardSchema],
    isArchieved : {
        type: Boolean,
        default: false
    },
    createdAt : {
        type: Date,
        default : Date.now()
    }
})

const List = model("lists", schema)

module.exports = List