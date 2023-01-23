const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/userprofile', (req, res) => {
    res.render('users/userprofile')
})

module.exports = router