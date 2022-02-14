const { Schema, model } = require("mongoose");

const schema = new Schema({
    validationCode: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isDone: {
        type: Boolean,
        required: true,
    },
});

const Passwordreset = model("passwordreset", schema);

module.exports = Passwordreset;