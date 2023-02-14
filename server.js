if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require ('express')
const app = express()
//const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')

const indexRouter = require('./routes/index')
const projectRouter = require('./routes/projects')
//const userRouter = require('./routes/users')
const releasenoteRouter = require('./routes/releasenotes')

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

app.use('/', indexRouter)
app.use('/', projectRouter)
//app.use('/', userRouter)
app.use('/', releasenoteRouter)

const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Listen on server
app.listen(process.env.PORT ||3000, function (err) {
    if (err) {
        console.log;(err)
    } else {
        console.log("Server Started at Port 3000")
    }
})

