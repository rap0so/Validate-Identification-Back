const express = require('express')
const app = express()
const routes = require('./routes')
const cors = require('cors')
const connectDb = require('./config/database')
const PORT = (process.env.NODE_ENV === 'test' && 5010) || 5003

app.use(cors())
app.use(express.json())

routes.forEach(route => {
  app.use('/' + route.path, route.controller)
})

connectDb.then(() =>
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
)

module.exports = app
