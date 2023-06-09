const mongoose = require('mongoose')
const url =require('./db/db.config')
mongoose
    .connect(url, { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports= db;