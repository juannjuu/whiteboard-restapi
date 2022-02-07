const { Schema, model } = require('mongoose')

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dry2yqm3h/image/upload/v1644199101/image/whiteboard/no-profile-pic_zyup0u.png"
    },
    company_name: String, 
    industry: String,
    role: String,
    createdAt : {
        type: Date,
        default : Date.now()
    }
})

const User = model('users', schema)

module.exports = User