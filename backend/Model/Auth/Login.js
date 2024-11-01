    const mongoose = require('mongoose');

    const loginSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true, 
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum:["admin","member"],
            default: "member"
        }
    });

    const login = mongoose.model('login', loginSchema);
    module.exports = login
