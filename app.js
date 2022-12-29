const express = require('express')
const cors = require('cors')

const app = express()

const path = require('path')
// const hbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('./public/js/user')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// app.set('views', path.join(__dirname, 'views'))
app.set('view engine','ejs')

app.set('views', __dirname + '/views' )
app.use('/public', express.static('public'))

// if(process.env.NODE_ENV !== 'production') {}
    require('dotenv').config()

// mongoose.set('strictQuery', false)

 mongoose
     .connect(process.env.MONGODB_URI)
     .then(() => console.log('CONECTED TO MONGODB'))
     .catch((error) => console.error(error))



// mongoose.connect(MONGODB_URI, function(err){
//     if(err) {
//         throw err
//     } else {
//         console.log(`Successfully connected to ${MONGODB_URI}`)
//     }
// })

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/register', (req, res) => {
    const {username, password} = req.body
    const user = new User({username, password})

    user.save(err => {
        if(err){
            res.status(500).send('ERROR TO REGISTER')
        } else {
            res.status(200).send('REGISTERED USER')
        }
    })
})

app.post('/authenticate', (req, res) => {
    const {username, password} = req.body

    User.findOne({username}, (err, user) => {
        if(err){
            res.status(500).send('ERROR TO AUTHENTICATE')
        } else if(!user){
            res.status(500).send('USER DOES NOT EXIST')
        } else {
            user.isCorrectPassword(password, (err, result) => {
                if(err){
                    res.status(500).send('ERROR TO AUTHENTICATE')
                } else if(result){
                    res.status(200).send('USER AUTHENTICATED CORRECTLY')
                } else {
                    res.status(500).send('USER AND/OR PASSWORD INCORRECTLY')
                }
            })
        }
    })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server started')
})

module.exports = app
