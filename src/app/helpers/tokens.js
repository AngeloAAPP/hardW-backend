const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const generateToken = (payload, expiresIn) => {
    return jwt.sign(payload, process.env.SALT_KEY, {
        expiresIn
    })
}

const generateRefreshToken = () => {
    const date = new Date()
    const timestamp = new Buffer.from(date).toString('hex')

    return `${crypto.randomBytes(10).toString('hex')}${timestamp}`
}

const verifyToken = token => {
    return jwt.verify(token, process.env.SALT_KEY)
}

module.exports = {generateToken, generateRefreshToken, verifyToken}