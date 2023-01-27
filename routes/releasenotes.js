const multer = require('multer')

const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Project = require('../models/project')
const ReleaseNote = require('../models/releasenote')

const upload = multer({ dest: 'uploads' })

// router.get('/', (req, res) => {
//     res.render('releasenotes/index')
// })

router.get('/new', async (req, res) => {
    // try {
    //     const users = await User.find({})
    //     const projects =  await Project.find({})
    //     const releasenote = new ReleaseNote()
    //     res.render('releasenotes/new', {
    //         users: users,
    //         projects: projects,
    //         releasenote: releasenote
    //     })
    // } catch {
    res.render('releasenotes/new')
    //console.log(req.user)
    // }
})

router.post('/new', upload.single('file'), async (req, res) => {
    const releasenoteData = {
        //user : req.user._id,
        title: req.body.title,
        path: req.file.path,
        originalName: req.file.originalname,
        description: req.body.description,
        createdAt: req.body.createdAt,
    }
    const releasenote = await ReleaseNote.create(releasenoteData)
    console.log(releasenote)
    res.redirect('/releasenote')
})

module.exports = router