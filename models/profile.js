const { Schema, model } = require("mongoose")

const schema = new Schema({
    userId: {
        type : Schema.Types.ObjectId,
        ref : "users",
        required : true,
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dry2yqm3h/image/upload/v1644199101/image/whiteboard/no-profile-pic_zyup0u.png"
    },
    companyName : {
        type: String,
    },
    industry : {
        type: String,
    },
    role : {
        type: String,
    },
    createdAt : {
        type: Date,
        default : Date.now()
    }
}) 

const Profile = model("profiles", schema)

module.exports = Profile
