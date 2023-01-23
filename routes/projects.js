const express = require('express')
const router = express.Router()
const Project = require('../models/project')


// Show All Projects Route
router.get('/home', async (req, res) => {
    try {
        const projects = await Project.find({})
        res.render('users/home', { projects: projects })
    } catch {
        res.redirect('/home')
    }
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

module.exports = router

