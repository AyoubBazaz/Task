const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'login',
        required: true,
    },
    username: {
        type: String,
        required: true,
    }, role: {
        type: String,
        enum:["admin","member"],
        default: "member"
    }
});

const register= mongoose.model('register', registerSchema);
module.exports =register