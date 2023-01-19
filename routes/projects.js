const express = require('express')
const router = express.Router()

router.get('/new_project', (req, res) => {
    res.render('projects/new_project')
})

router.get('/main', (req, res) => {
    res.render('projects/main')
})

module.exports = router

