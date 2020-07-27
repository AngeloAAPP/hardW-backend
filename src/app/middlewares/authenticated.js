const {verifyToken} = require('../helpers/tokens')
const {decode} = require('../helpers/hashids')

module.exports = authenticated = (req, res, next) => {

    const {authorization} = req.headers

    try{
        const token = authorization.split(' ')

        if(token[0].toLowerCase() !== 'bearer' || token.length !== 2)
            throw new Error();

        const {user} = verifyToken(token[1])
        req.user = decode(user)
        return next()
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "Acesso restrito"
        })
    }
}