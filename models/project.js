const mongoose = require('mongoose')
const path = require('path')

const logoBasePath = 'project_logo'

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgLogo: {
        type: String,
        required: true
    }    
})

projectSchema.virtual('logoPath').get(function() {
    if (this.imgLogo != null) {
        return path.join('/', logoBasePath, this.imgLogo)
    }
})

module.exports = mongoose.model('Project', projectSchema)