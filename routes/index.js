const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const LocalStrategy = require("passport-local")
// const methodOverride = require('method-override')
// const passportLocalMongoose = require("passport-local-mongoose") 
const router = express.Router()
const User = require("../models/user")

// router.use(methodOverride('_method'))
router.use(require("express-session")({
    secret: process.env.SESSION_SECRET, //decode or encode session
    resave: false,          
    saveUninitialized: false    
}))

passport.serializeUser(User.serializeUser())       //session encoding
passport.deserializeUser(User.deserializeUser())   //session decoding
passport.use(new LocalStrategy(User.authenticate()))
router.use(bodyParser.urlencoded({ extended:true }))
router.use(passport.initialize())
router.use(passport.session())

// Route to the Main Page
router.get('/', (req, res) => {
    res.render('logins/index')
})

// Route to the LogIn Page
router.get('/login', (req, res) => {
    res.render('logins/login')
})

// Route to the User Profile
// router.get("/home", (req,res) => {
//     res.render("users/home")
// })

// Route to the Register Page
router.get ('/register', chechNotAuthenticated, (req, res) => {
    res.render('logins/register')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: 'home',
    failureRedirect: '/login'
}), function (req, res) {
})

router.post("/register",(req,res)=>{
    User.register(new User({username: req.body.username,email:req.body.email}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("logins/register")
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/login")
    })    
    })
})

// Route to Log Out
router.get("/logout",(req,res)=>{
    //req.logOut()
    res.redirect("/")
})

// function chechAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next()
//     }
//     res.redirect('/login')
// }

function chechNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/home')
    }
    next()
}

module.exports = router