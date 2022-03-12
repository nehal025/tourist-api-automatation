const jwt = require('jsonwebtoken')


module.exports = function auth(req, res, next) {

    const token = req.query
    
    if (!token) return res.send('Acess Denied')

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()

    } catch (err) {

        return res.send('Invalid token')

    }

}