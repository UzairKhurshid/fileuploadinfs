require('../server/db/mongoose')
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const multer = require('multer')
const session = require('express-session')
const mongoStoreSession = require('connect-mongodb-session')(session)
const app = express()

const dbStore = new mongoStoreSession({
    uri: process.env.MONGODB_URL,
    collection: 'sessions'
});
app.use(session({
    secret: 'secret key encrypt session',
    resave: false,
    saveUninitialized: false,
    store: dbStore
}))
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'avatars')
    },
    filename: (req, file, cb) => {
        cb(null, 'avatars-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
    //routes
const authRoute = require('../server/routes/auth')
const dashboardRoute = require('../server/routes/dashboard')


const publicDirectory = path.join(__dirname, '../public')
const avatarsDirectory = path.join(__dirname, '../avatars')
const viewDirectory = path.join(__dirname, '../views')
const partialsDirectory = path.join(__dirname, '../views/shared')

const port = process.env.PORT
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/avatars', express.static(avatarsDirectory))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('avatar'))
app.set('view engine', 'hbs')
app.set('views', viewDirectory)
hbs.registerPartials(partialsDirectory)


app.use(authRoute)
app.use(dashboardRoute)


app.listen(port, () => {
    console.log('listning on port ' + port)
})