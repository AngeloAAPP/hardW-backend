const redis = require('redis')
const redisConfig = require('../../config/redis')

const client = redis.createClient(redisConfig)

const setCache = (client, key, value, time) => {
    return new Promise((resolve, reject) => {
        client.set(key, value, 'ex', time, (err) => {
            if(err)
                reject(err)
            resolve(true)
        })
    })
}

const getCache = (client, key) => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, value) => {
            if(err)
                reject(err)
            resolve(value)
        })
    })
}

const destroyCache = (client, key) => {
    return new Promise((resolve, reject) => {
        client.DEL(key, (err, value) => {
            if(err)
                reject(err)
            resolve(value)
        })
    })
}

module.exports = {client, setCache, getCache, destroyCache}