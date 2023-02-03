const mongoose = require('mongoose')

const ReleaseNote = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    path: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    }
})

module.exports = mongoose.model('ReleaseNote', ReleaseNote)
