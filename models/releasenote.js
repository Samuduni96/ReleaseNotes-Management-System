const mongoose = require('mongoose')
const User = require('./user')

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
        required: false
    },
    originalName: {
        type: String,
        required: false
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
    },
    releaseVersion: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('ReleaseNote', ReleaseNote)
