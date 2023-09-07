const express = require('express')
const app = express()
const books = require('./src/books/routes')
const auth = require('./src/auth/routes')
const users = require('./src/users/router')
const guard = require('./src/middlewares/jwt')
const cors = require('cors')
const { env } = require('./config/config')

app.use(cors())
app.use(express.json())
app.use('/books', books)
app.use('/auth', auth)
app.use('/users', guard, users)
app.use('/books/images', express.static('./src/static/books'))
app.use('/static/users_books/', express.static('./src/static/users_books'))

app.listen(env.port, () => {
    console.log(`Listening on port ${env.port}`)
})


app.get('/ping', (_, res) => {
    res.status(200).send('pong')
})

