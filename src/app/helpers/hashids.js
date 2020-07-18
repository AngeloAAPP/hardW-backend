const Hashids = require('hashids/cjs')
const hashids = new Hashids(process.env.SALT_KEY, 6)

const encode = value => {
    return hashids.encodeHex(value.toString())
}

const decode = hashid => {
    return hashids.decodeHex(hashid)
}

module.exports = {encode, decode}