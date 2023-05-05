const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'https://img.freepik.com/free-icon/user_318-804790.jpg'
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user']
    }
})


const userModel = mongoose.model('user', userSchema);

module.exports = {
    userModel
}

