const express = require('express')
const multer = require('multer')
const router = express.Router()
const Project = require('../models/project')
const ReleaseNote = require('../models/releasenote')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
const upload = multer({ dest: 'uploads' })
const upload_logo = multer({ 
    dest: 'public/project_logo',
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype ))
    } 
})

// Show All Projects Route
router.get('/home', chechAuthenticated, async (req, res) => {
    try {
        const projects = await Project.find({})
        res.render('users/home', { projects: projects })
    } catch {
        res.redirect('/home')
    }
})

router.get('/userprofile', async (req, res, next) => {
    const user = req.user
    const releasenotes = await ReleaseNote.find({user: user.id}).sort({ CreatedAt: 'desc' })
    res.render('users/userprofile', {user: user, releasenotes: releasenotes})
})

// New Project Route
router.get('/new_project', (req, res) => {
    res.render('projects/new_project', { project: new Project()}) // this variable we pass here goes to the .ejs file
})

// Create Project Route
router.post('/new_project', upload_logo.single('imgLogo'), async (req, res) => {
    const project = new Project({
        name: req.body.name,
        description: req.body.description,
        imgLogo: req.file.filename
    })
    try {
        const newProject = await project.save()
        res.redirect('/home')
    } catch {
        res.render('projects/new_project', {
            project: project,
            errorMessage: 'Error Creating the Project'
        })
    }
})

router.get('/userprofile/:r_id/view', async (req, res) => {
    const releasenote = await ReleaseNote.findById(req.params.r_id)
    res.render('users/show', {releasenote: releasenote})
})

router.get('/userprofile/:r_id/edit', async (req, res) => {
    try {
        const releasenote = await ReleaseNote.findById(req.params.r_id)
        res.render('users/edit', { releasenote: releasenote })
    } catch {
        res.redirect('/userprofile')
    }
})

router.put('/userprofile/:r_id', upload.single('file'), async (req, res) => {
    const filePath = req.file != null ? req.file.path: null
    const fileOrgName = req.file != null ? req.file.originalname: null
    let releasenote
    try {
        releasenote = await ReleaseNote.findById(req.params.r_id)
        releasenote.user = await req.user.id,
        releasenote.title = req.body.title,
        releasenote.path = filePath,
        releasenote.originalName = fileOrgName,
        releasenote.releaseVersion = req.body.releaseVersion,
        releasenote.description = req.body.description,
        releasenote.createdAt = req.body.createdAt
        await releasenote.save()
        res.redirect(`/userprofile/${releasenote.id}/view`)
    } catch {
        if (releasenote == null){
            res.redirect('/userprofile')
        } else {
            res.render('users/edit', { 
                releasenote: releasenote,
                error: 'Error Updating Releasenote'  
            })
        }
    }
})

router.get('/userprofile/:id', async (req, res) => {
    const releasenotes = await ReleaseNote.findById(req.params.id)
    await releasenotes.save()
    res.download(releasenotes.path, releasenotes.originalName)
})

function chechAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

module.exports = router


