const express = require('express')
const router = express.Router()
const User = require('../models/user')
const ReleaseNote = require('../models/releasenote')

// router.get('/:id', async (req, res) => {
//     try {
//         const user = await req.user._id
//         const releasenote = await ReleaseNote.find({ user: user }).limit(10).exec()
//         res.render('users/userprofile', {
//             user: user,
//             releasenoteByUser: releasenote
//         })
//     } catch {
//         res.redirect('/home')
//     }
// })

module.exports = router