const express = require('express')
const Task = require('../models/task')
const fileUpload = require('../models/fileupload')
const auth = require('../middleware/auth')
const path = require('path')

const router = new express.Router()

router.get('/', auth, async(req, res) => {
    try {
        const tasks = await Task.find()
        res.render('dashboard/index', {
            title: 'Dashboard',
            tasks: tasks
        })
    } catch (e) {
        console.log(e.message)
        res.redirect('/')
    }
})

router.post('/', async(req, res) => {
    try {

        const task = new Task(req.body)
        await task.save()

        res.redirect('/')

    } catch (e) {
        console.log(e.message)
        res.redirect('/')
    }
})

router.get('/fileupload', auth, async(req, res) => {
    try {
        const email = 'umair12@gmail.com'
        const user = await fileUpload.findOne({ email })
        console.log(user)
        if (!user) {
            return res.render('dashboard/fileupload', {
                title: 'Dashboard'
            })
        }

        res.render('dashboard/fileupload', {
            title: 'Dashboard',
            dirName: __dirname,
            filepath: user.filepath
        })

    } catch (e) {
        console.log(e.message)
        res.redirect('/')
    }
})

router.post('/fileupload', auth, async(req, res) => {
    try {
        const name = req.body.name
        const email = req.body.email
        const avatar = req.file

        const fileupload = new fileUpload()
        fileupload.name = name
        fileupload.email = email
        fileupload.filepath = avatar.path
        await fileupload.save()
        res.redirect('/fileupload')

    } catch (e) {
        console.log(e.message)
        res.redirect('/')
    }
})


router.post('/logout', auth, (req, res) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/login')
    })
})

module.exports = router