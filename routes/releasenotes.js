const multer = require('multer')

const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const User = require('../models/user')
const Project = require('../models/project')
const ReleaseNote = require('../models/releasenote')

const upload = multer({ dest: 'uploads' })

// router.get('/', (req, res) => {
//     res.render('releasenotes/index')
// })

router.get('/new', async (req, res) => {
    // try {
    //     const projects =  await Project.findById(req.params.id)
    //     res.render(':id/new', { projects: projects})
    // } catch {
        res.render('releasenotes/new')
    //}
})

router.post('/new', upload.single('file'), async (req, res) => {
    const releasenoteData = {
        user : await req.user._id,
        //project: await Project.findById(req.params.id),
        title: req.body.title,
        path: req.file.path,
        originalName: req.file.originalname,
        description: req.body.description,
        createdAt: req.body.createdAt,
    }
    try {
        const releasenote = await ReleaseNote.create(releasenoteData)
        console.log(releasenote)
        //console.log(req.user)
        //console.log(project)
        res.redirect('/releasenote')
    } catch {
        if (releasenoteData.path != null) {
            //removeFile(releasenoteData.path)
            res.render('releasenotes/new', {
                errorMessage: 'Error Creating the Release Note'
            })
        }
    }
})

// function removeFile(path) {
//     fs.unlink(path.join(path.join('uploads', ReleaseNote.upload), path), err => {
//         if (err) console.error(err)
//     })
// }

module.exports = router