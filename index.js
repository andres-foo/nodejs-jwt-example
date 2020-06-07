require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()

const router = express.Router()

// constants
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1'
const SECRET_KEY = process.env.SECRET_KEY || 'secretkey'

// regular route
router.get('/', (req, res) => {
  res.send('Home')
})

// login
router.post('/login', (req, res) => {
  // TODO: verify user exists

  // payload with user data
  const payload = {
    userid: 1,
    username: req.body.username
  }
  // create token
  jwt.sign(payload, SECRET_KEY, (err, token) => {
    if(err) {
      res.json({error: 'Couldn\'t generate a key'})
    }
    res.json({token})
  })  
})

// protected route
router.post('/protected', verifyToken, (req, res) => {
  res.send(req.decoded)
})

// verify token and attach decoded data to request
function verifyToken(req, res, next) {
  // get token
  const authorization = req.headers['authorization']
  const token = authorization.split(' ')[1]
  // verify token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if(err) {
      return res.status(403).send('Forbidden')
    }
    req.decoded = decoded
    next()
  }) 
}

// parse requests of content-type - application/json
app.use(express.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}))
// routes at the end to allow previous middleware to act
app.use(router)

//start
app.listen(3000, () => console.log(`Listening on http://${HOST}:${PORT}`))
