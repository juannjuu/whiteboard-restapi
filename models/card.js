const { Schema, model } = require("mongoose")

const assignSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    name: {
        type: String
    }
})

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    name: {
        type: String
    },
    comment: {
        type: String
    }
})

const checklistSchema = new Schema({
    name: {
        type: String
    },
    isChecked: {
        type: Boolean,
        default: false
    }
})

const schema = new Schema({
    listId: {
        type: Schema.Types.ObjectId,
        ref: "lists",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    assignTo: {
        type: [assignSchema]
    },
    priority: {
        type: String
    },
    dueDate: {
        type: Date
    },
    labels: {
        type: Array,
        // default: ['UI/UX', 'Development', 'Music']
    },
    comments: {
        type: [commentSchema]
    },
    attachment: {
        type: Array
    },
    checklist: {
        type: [checklistSchema]
    },
    isArchieved: {
        type: Boolean,
        default: false
    },
    createdAt : {
        type: Date,
        default : Date.now()
    }
})

const Card = model("cards", schema)

module.exports = Card