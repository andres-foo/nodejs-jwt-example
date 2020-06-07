require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()

const router = express.Router()

// regular route
router.get('/', (req, res) => {
  res.send('Home')
})

// login
router.post('/login', (req, res) => {
  res.json(req.body)
})

// protected
router.post('/protected', (req, res) => {
  res.send('Protected data')
})

// parse requests of content-type - application/json
app.use(express.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}))
// routes at the end to allow previous middleware to act
app.use(router)

// start
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1' 

app.listen(3000, () => console.log(`Listening on http://${HOST}:${PORT}`))
