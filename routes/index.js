const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const LocalStrategy = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose") 
const router = express.Router()
const User = require("../models/user")

router.use(require("express-session")({
    secret:"Any normal Word",//decode or encode session
    resave: false,          
    saveUninitialized:false    
}))

passport.serializeUser(User.serializeUser())       //session encoding
passport.deserializeUser(User.deserializeUser())   //session decoding
passport.use(new LocalStrategy(User.authenticate()))
router.use(bodyParser.urlencoded(
      { extended:true }
))
router.use(passport.initialize())
router.use(passport.session())

// Route to the Main Page
router.get('/', (req, res) => {
    res.render('logins/home')
})

// Route to the LogIn Page
router.get('/login', (req, res) => {
    res.render('logins/login')
})

// Route to the User Profile
router.get("/userprofile" ,(req,res) =>{
    res.render("users/userprofile")
})

// Route to the Register Page
router.get ('/register', (req, res) => {
    res.render('logins/register')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: 'userprofile',
    failureRedirect: '/login'
}), function (req, res) {
})

router.post("/register",(req,res)=>{
    User.register(new User({username: req.body.username,phone:req.body.phone}),req.body.password,function(err,user){
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
//   req.logout()
    res.redirect("/")
})

module.exports = router