const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(
        "mongodb+srv://admin:admin@cluster0.w3tfs.mongodb.net/whiteboard?retryWrites=true&w=majority", {},
        (error) => {
            if (error) {
                console.log(error)
                return;
            }
            console.log("Connected to DB")
        })
}