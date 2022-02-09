const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect(
        "mongodb+srv://admin:admin@cluster0.w3tfs.mongodb.net/whiteboard?retryWrites=true&w=majority",
        (err) => {
            if (err) {
                console.log("failed to connect mongodb");
            } else {
                console.log("connected to mongodb");
            }
        }
    );
};