const {decode} = require('../helpers/hashids')

module.exports = authorizaded = (req, res, next) => {
    const {userID} = req.params


    if(decode(userID) !== req.user)
        return res.status(403).json({
            success: false,
            message: "Acesso negado"
        })
        
    return next()
}