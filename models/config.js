const mongoose = require('mongoose')
const currentMongoUrl = (process.env.NODE_ENV === 'test' && 'mongodb://127.0.0.1:27017/dooile-test') || process.env.DATABASE_URL
console.log(process.env.NODE_ENV)

module.exports =
  mongoose.connect(currentMongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
