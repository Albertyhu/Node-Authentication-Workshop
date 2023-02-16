const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const User = new Schema({
        username: { type: String, required: true },
        email: {type: String, required: true}, 
        password: { type: String, required: true }
});

module.exports = mongoose.model("Users", User); 