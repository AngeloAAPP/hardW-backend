const {verifyToken} = require('../helpers/tokens')
const {decode} = require('../helpers/hashids')

//checks if the user is authenticated and has permission
module.exports = authenticated = (req, res, next) => {

    const {authorization} = req.headers
    const userID = req.body.userID || req.query.userID

    try{
        const token = authorization.split(' ')

        if(token[0].toLowerCase() !== 'bearer' || token.length !== 2)
            throw new Error();

        const {user} = verifyToken(token[1])
        req.user = decode(user)
        console.log(decode(user))
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "Acesso restrito"
        })
    }

    if(decode(userID) !== req.user)
        return res.status(403).json({
            success: false,
            message: "Acesso negado"
        })
        
    return next()
}