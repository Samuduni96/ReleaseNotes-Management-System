if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require ('express')
const app = express()

const indexRouter = require('./routes/index')
const projectRouter = require('./routes/projects')

app.set('view engine', 'ejs')

app.use('/', indexRouter)
app.use('/', projectRouter)

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

