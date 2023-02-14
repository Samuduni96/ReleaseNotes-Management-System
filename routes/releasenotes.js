const multer = require('multer')
const express = require('express')
const router = express.Router()
const fs = require('fs')

//const flash = require('connect-flash')
const Project = require('../models/project')
const ReleaseNote = require('../models/releasenote')

const upload = multer({ dest: 'uploads' })
//router.use(flash())

router.get('/rel/:id', async (req, res) => {
    const project =  await Project.findById(req.params.id)
    const releasenotes = await ReleaseNote.find({ project: project })
    res.render('releasenotes/index', {releasenotes: releasenotes, project: project})
})

router.get('/rel/:id/new', async (req, res) => {
    const project =  await Project.findById(req.params.id)
    res.render('releasenotes/new', {project: project})
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
        res.redirect(`/rel/${releasenoteData.project.id}`)
    } catch {
        if (releasenoteData.path != null) {
            removeFile(releasenoteData.path)
            res.redirect(`/rel/${releasenoteData.project.id}/new`)       
        }       
    }
})

router.get('/rel/:id/:id', async (req, res) => {
    const releasenotes = await ReleaseNote.findById(req.params.id)
    await releasenotes.save()
    res.download(releasenotes.path, releasenotes.originalName)
})

router.delete('/userprofile/:id', async (req, res) => {
    let releasenotes
    try {
        releasenotes = await ReleaseNote.findById(req.params.id)
        await releasenotes.remove()
        removeFile(releasenotes.path)
        res.redirect('/userprofile')
    } catch {
        res.redirect ('/home')
    }
})

function removeFile(path) {
    fs.unlink(path, function(err) {
        if (err) throw err
    }) 
}

module.exports = router