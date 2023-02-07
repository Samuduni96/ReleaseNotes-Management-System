const multer = require('multer')
const express = require('express')
const router = express.Router()
//const fs = require('fs')
//const path = require('path')
//const User = require('../models/user')
const Project = require('../models/project')
const ReleaseNote = require('../models/releasenote')
const project = require('../models/project')

const upload = multer({ dest: 'uploads' })

router.get('/rel/:id', async (req, res) => {
    const project =  await Project.findById(req.params.id)
    const releasenotes = await ReleaseNote.find({ project: project })
    res.render('releasenotes/index', {releasenotes: releasenotes, project: project})
})

router.get('/rel/:id/new', async (req, res) => {
    // try {
        const project =  await Project.findById(req.params.id)
        res.render('releasenotes/new', {project: project})
    // } catch {
        // res.render(`releasenote/${project.id}/new`, { project: project })
    //}
})

router.post('/rel/:id/new', upload.single('file'), async (req, res) => {
    const releasenoteData = {
        user : await req.user._id,
        project: await Project.findById(req.params.id),
        title: req.body.title,
        path: req.file.path,
        originalName: req.file.originalname,
        releaseVersion: req.body.releaseVersion,
        description: req.body.description,
        createdAt: req.body.createdAt,
    }
    try {
        const releasenote = await ReleaseNote.create(releasenoteData)
        res.redirect('/home')
    } catch {
        if (releasenoteData.path != null) {
            //removeFile(releasenoteData.path)
            res.redirect(`/rel/${project.id}/new`, {
                errorMessage: 'Error Creating the Release Note'
            })
        }
    }
})

router.get('/rel/:id/:id', async (req, res) => {
    const releasenotes = await ReleaseNote.findById(req.params.id)
    await releasenotes.save()
    res.download(releasenotes.path, releasenotes.originalName)
})

// function removeFile(path) {
//     fs.unlink(path.join(path.join('uploads', ReleaseNote.upload), path), err => {
//         if (err) console.error(err)
//     })
// }

module.exports = router