const express = require('express');
const router = express.Router();


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verify = require('./verifyToken')


const User = require('../models/userModel');
const hotelRecommendation = require('../models/hotelRecommendation');
const restaurantRecommendation = require('../models/restaurantRecommendatio');
const Recommendation = require('../helpers/Recommendation');


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

         await hotelRecommendation.create({
            username: username, _1star: "0", _2star: "0", _3star: "0", _4star: "0", _5star: "0"

        })

        const resRec = await restaurantRecommendation.create({
            username: username

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


router.post('/recommendation/hotel', async (req, res) => {

    const { token, _1star, _2star, _3star, _4star, _5star } = req.query
    if (!token) return res.send('Acess Denied')

    let allHotelStar = [_1star, _2star, _3star, _4star, _5star];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        const verifiedUsername = verified.username
        const user = await User.findOne({ username: verifiedUsername }).lean()

        if (!user) {

            res.status(400)
            return res.json({ status: 'error', error: 'Invalid username/password' })

        } else {

            let ans = Recommendation(allHotelStar)

            hotelRecommendation.updateOne(
                { username: user.username },
                [{ $set: { _1star: _1star, _2star: _2star, _3star: _3star, _4star: _4star, _5star: _5star, recommendation: ans } }]

            ).exec()
            const userRec = await hotelRecommendation.findOne({ verifiedUsername }).lean()

            console.log(userRec)
            return res.json(userRec)

        }

    } catch (error) {
        console.log(error)
        return res.json({ status: 'error', error: 'something went wrong' })
    }
    

})


router.get('/recommendation/hotel', async (req, res) => {

    try {
        const token = req.query.token
        const user = jwt.verify(token, process.env.JWT_SECRET)
        const username = user.username
        const userRec = await hotelRecommendation.findOne({ username }).lean()
        res.json(userRec)
    } catch (error) {
        res.json({ status: 'error', error: 'something went wrong' })

    }


})


router.get('/recommendation/restaurants', async (req, res) => {

    try {
        const token = req.query.token
        const user = jwt.verify(token, process.env.JWT_SECRET)
        const username = user.username
        const userRec = await restaurantRecommendation.findOne({ username }).lean()
        res.json({ category: userRec.recommendation })
    } catch (error) {
        res.json({ status: 'error', error: 'something went wrong' })

    }


})

router.post('/recommendation/restaurants', async (req, res) => {

    const { token } = req.query
    const allHotelStar = req.body.category

    if (!token) return res.send('Acess Denied')



    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        const verifiedUsername = verified.username
        const user = await User.findOne({ username: verifiedUsername }).lean()

        if (!user) {

            res.status(400)
            return res.json({ status: 'error', error: 'Invalid username/password' })

        } else {

            if (allHotelStar.length === 0) {
                var selected = [];
                restaurantRecommendation.updateOne(
                    { username: user.username },
                    [{ $set: { recommendation: selected } }]


                ).exec()
                const userRec = await restaurantRecommendation.findOne({ username: user.username }).lean()
                res.json(userRec)

            } else {

                restaurantRecommendation.updateOne(
                    { username: user.username },
                    [{ $set: { recommendation: allHotelStar } }]

                ).exec()

                const userRec = await restaurantRecommendation.findOne({ verifiedUsername }).lean()
                res.json(userRec)

            }




        }

    } catch (error) {
        console.log(error)
        return res.json({ status: 'error', error: 'something went wrong' })
    }

})


router.post('/recommendation/clear', async (req, res) => {

    const { token } = req.query
    if (!token) return res.send('Acess Denied')


    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        const verifiedUsername = verified.username
        
        const user = await User.findOne({ username: verifiedUsername }).lean()

        if (!user) {

            res.status(400)
            return res.json({ status: 'error', error: 'Invalid username/password' })

        } else {

            let ans = []

            hotelRecommendation.updateOne(
                { username: user.username },
                [{ $set: { _1star: "0", _2star: "0", _3star: "0", _4star: "0", _5star: "0", recommendation: ans } }]

            ).exec()

            restaurantRecommendation.updateOne(
                { username: user.username },
                [{ $set: { recommendation: ans } }]

            ).exec()

            const userRec = await hotelRecommendation.findOne({ username: user.username }).lean()

            console.log(userRec)
            return res.json(userRec)

        }

    } catch (error) {
        console.log(error)
        return res.json({ status: 'error', error: 'something went wrong' })
    }




})

module.exports = router;
