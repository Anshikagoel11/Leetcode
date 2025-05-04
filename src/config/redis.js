const redis = require('redis')
require('dotenv').config();

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.redis_pass,
    socket: {
        host: process.env.host_link,
        port: process.env.redis_port
    }
})

module.exports=redisClient;