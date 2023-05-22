const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    ipAddress: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    metaData: {
        type: Object
    }
})

const logModel = mongoose.model('log', logSchema);

module.exports = {
    logModel
}
