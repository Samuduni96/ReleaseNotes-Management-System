const express = require('express')
const multer = require('multer')
const router = express.Router()
const fs = require('fs')
//const flash = require('connect-flash')
const Project = require('../models/project')
const ReleaseNote = require('../models/releasenote')
const project = require('../models/project')

const upload = multer({ dest: 'uploads' })
//router.use(flash())

router.get('/rel/:id', async (req, res) => {
    const project =  await Project.findById(req.params.id)
    const releasenotes = await ReleaseNote.find({ project: project }).sort({ CreatedAt: 'desc' })
    res.render('releasenotes/index', {releasenotes: releasenotes, project: project})
})

router.get('/rel/:id/new', async (req, res) => {
    const project =  await Project.findById(req.params.id)
    res.render('releasenotes/new', {
        project: project
    })
})

router.post('/rel/:id/new', upload.single('file'), async (req, res) => {
    const filePath = req.file != null ? req.file.path: null
    const fileOrgName = req.file != null ? req.file.originalname: null
    const releasenoteData = {
        user : await req.user._id,
        project: await Project.findById(req.params.id),
        title: req.body.title,
        path: filePath,
        originalName: fileOrgName,
        releaseVersion: req.body.releaseVersion,
        description: req.body.description,
        createdAt: req.body.createdAt,
    }
    try {
        const releasenote = await ReleaseNote.create(releasenoteData)
        res.redirect(`/rel/${releasenoteData.project.id}`)
    } catch {     
        if (releasenoteData.path != null) {         // not needed
            removeFile(releasenoteData.path)        
            res.redirect(`/rel/${releasenoteData.project.id}/new`)   
        } 
    }
})

router.get('/rel/:id', async (req, res) => {
    const releasenotes = await ReleaseNote.findById(req.params.id)
    await releasenotes.save()
    res.download(releasenotes.path, releasenotes.originalName)
})

router.get('/rel/:p_id/:r_id', async (req, res) => {
    try {
        const project =  await Project.findById(req.params.p_id)
        const releasenote = await ReleaseNote.findById(req.params.r_id)
        res.render('releasenotes/show', { project: project, releasenote: releasenote })
    } catch {
        res.redirect(`/rel/${project.id}/${releasenote.id}`)
    }
})

router.get('/rel/:p_id/:r_id/edit', async (req, res) => {
    try {
        const project =  await Project.findById(req.params.p_id)
        const releasenote = await ReleaseNote.findById(req.params.r_id)
        res.render('releasenotes/edit', { project: project, releasenote: releasenote })
    } catch {
        res.redirect(`/rel/${project.id}/${releasenote.id}`)
    }
})

router.put('/rel/:p_id/:r_id', upload.single('file'), async (req, res) => {
    //console.log(req.body)
    const filePath = req.file != null ? req.file.path: null
    const fileOrgName = req.file != null ? req.file.originalname: null
    const project = await Project.findById(req.params.p_id)
    let releasenote
    try {
        releasenote = await ReleaseNote.findById(req.params.r_id)
        releasenote.user = await req.user.id,
        releasenote.project = project.id,
        releasenote.title = req.body.title,
        releasenote.path = filePath,
        releasenote.originalName = fileOrgName,
        releasenote.releaseVersion = req.body.releaseVersion,
        releasenote.description = req.body.description,
        releasenote.createdAt = req.body.createdAt
        await releasenote.save()
        res.redirect(`/rel/${project.id}/${releasenote.id}`)
    } catch {
        if (releasenote == null){
            res.redirect(`/rel/${project.id}/${releasenote.id}`)
        } else {
            res.render('releasenotes/edit', { 
                project: project, 
                releasenote: releasenote,
                error: 'Error Updating Releasenote'  
            })
        }
    }
})

router.get('/rel/:p_id/:r_id/copy', async (req, res) => {
    try {
        const project =  await Project.findById(req.params.p_id)
        const releasenote = await ReleaseNote.findById(req.params.r_id)
        res.render('releasenotes/copy', { project: project, releasenote: releasenote })
    } catch {
        res.redirect(`/rel/${project.id}/${releasenote.id}`)
    }
})

router.post('/rel/:p_id/:r_id/copy', upload.single('file'), async (req, res) => {
    const filePath = req.file != null ? req.file.path: null
    const fileOrgName = req.file != null ? req.file.originalname: null
    const releasenoteData = {
        user : await req.user._id,
        project: await Project.findById(req.params.p_id),
        title: req.body.title,
        path: filePath,
        originalName: fileOrgName,
        releaseVersion: req.body.releaseVersion,
        description: req.body.description,
        createdAt: req.body.createdAt,
    }
    try {
        const releasenote = await ReleaseNote.create(releasenoteData)
        res.redirect(`/rel/${releasenoteData.project.id}`)
    } catch {     
        if (releasenoteData.path != null) {         // not needed
            removeFile(releasenoteData.path)        
            res.redirect(`/rel/${releasenoteData.project.id}/copy`)   
        } 
    }
})

router.delete('/userprofile/:id', async (req, res) => {
    let releasenotes
    try {
        releasenotes = await ReleaseNote.findById(req.params.id)
        await releasenotes.remove()
        if (releasenotes.path != null) {
            removeFile(releasenotes.path)
        }
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