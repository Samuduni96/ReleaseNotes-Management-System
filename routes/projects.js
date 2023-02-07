const express = require('express')
const router = express.Router()
const Project = require('../models/project')
const ReleaseNote = require('../models/releasenote')


// Show All Projects Route
router.get('/home', async (req, res) => {
    try {
        const projects = await Project.find({})
        res.render('users/home', { projects: projects })
        //console.log(req.user._id)
    } catch {
        res.redirect('/home')
    }
})

router.get('/userprofile', async (req, res, next) => {
    const user = req.user
    const releasenotes = await ReleaseNote.find({user: user.id})
    res.render('users/userprofile', {user: user, releasenotes: releasenotes})
})

// New Project Route
router.get('/new_project', (req, res) => {
    res.render('projects/new_project', { project: new Project()}) // this variable we pass here goes to the .ejs file
})

// Create Project Route
router.post('/new_project', async (req, res) => {
    const project = new Project({
        name: req.body.name,
        description: req.body.description
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

router.get('/userprofile/:id', async (req, res) => {
    const releasenotes = await ReleaseNote.findById(req.params.id)
    await releasenotes.save()
    res.download(releasenotes.path, releasenotes.originalName)
})

module.exports = router


