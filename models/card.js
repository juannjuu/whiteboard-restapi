const { Schema, model } = require("mongoose")

const assignSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
})

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
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

const attachmentSchema = new Schema({
    fileName : {
        type: String
    },
    linkFile: {
        type: String
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
    },
    comments: {
        type: [commentSchema]
    },
    attachment: {
        type: [attachmentSchema]
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