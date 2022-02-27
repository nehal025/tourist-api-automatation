const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const userRecommendation = require('../models/userRecommendation');
const Recommendation = require('../Recommendation');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verify = require('./verifyToken')


router.post('/register', async (req, res) => {

    const { username, name, password: plainTextPassword } = req.body

    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username' })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (plainTextPassword.length < 5) {
        return res.json({
            status: 'error',
            error: 'Password too small. Should be atleast 6 characters'
        })
    }

    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        const response = await User.create({
            username,
            name,
            password

        })

        const res = await userRecommendation.create({
         username: username, _1star: "0", _2star: "0", _3star: "0", _4star: "0", _5star: "0"

        })
        console.log('User created successfully: ', response)

    } catch (error) {
        if (error.code === 11000) {
            // duplicate key
            res.status(400)

            return res.json({ status: 'error', error: 'Username already in use' })
        }
        throw error
    }

    const user = await User.findOne({ username }).lean()

    const token = jwt.sign(
        {
            id: user._id,
            name: user.name,
            username: user.username,

        },
        process.env.JWT_SECRET
    )
    res.status(200)
    res.json({ status: 'ok', data: token })

})


router.post('/login', async (req, res) => {

    const { username, password } = req.body
    const user = await User.findOne({ username }).lean()

    if (!user) {
        res.status(400)
        return res.json({ status: 'error', error: 'Invalid username/password' })
    }

    if (await bcrypt.compare(password, user.password)) {
        // the username, password combination is successful

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                username: user.username

            },
            process.env.JWT_SECRET
        )

        res.status(200)


        return res.json({ status: 'ok', data: token })
    }
    res.status(400)

    res.json({ status: 'error', error: 'Invalid username/password' })

})


router.post('/logout', async (req, res) => {
    
    const { token } = req.body
    res.status(200)
    res.json({ status: 'ok' })
})

router.post('/change-password', async (req, res) => {

    const { token, newpassword: plainTextPassword } = req.body

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (plainTextPassword.length < 5) {

        return res.json({
            status: 'error',
            error: 'Password too small. Should be atleast 6 characters'
        })

    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        const _id = user.id
        const password = await bcrypt.hash(plainTextPassword, 10)

        await User.updateOne(
            { _id },
            {
                $set: { password }
            }
        )

        res.json({ status: 'ok' })

    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'something went wrong' })
    }
})


router.post('/recommendation', async (req, res) => {

    const { token,_1star, _2star, _3star, _4star, _5star } = req.query
    if (!token) return res.send('Acess Denied')

    let allHotelStar = [_1star, _2star, _3star, _4star, _5star];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        const verifiedUsername = verified.username
        const user = await User.findOne({ username:verifiedUsername }).lean()

        if (!user) {

            res.status(400)
            return res.json({ status: 'error', error: 'Invalid username/password' })

        } else {

            let ans = Recommendation(allHotelStar)

            userRecommendation.updateOne(
                { username: user.username },
                [{ $set: { _1star: _1star, _2star: _2star, _3star: _3star, _4star: _4star, _5star: _5star, recommendation: ans } }]
                
            ).exec()
            const userRec = await userRecommendation.findOne({ verifiedUsername }).lean()


            return res.json(userRec)

        }

    } catch (error) {
        console.log(error)
        return res.json({ status: 'error', error: 'something went wrong' })
    }

})


router.get('/recommendation', async (req, res) => {

    try {
        const token = req.query.token
        const user = jwt.verify(token, process.env.JWT_SECRET)
        const username = user.username
        const userRec = await userRecommendation.findOne({ username }).lean()
        res.json(userRec)
    } catch (error) {
        res.json({ status: 'error', error: 'something went wrong' })

    }


})

module.exports = router;
