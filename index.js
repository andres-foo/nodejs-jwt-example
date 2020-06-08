require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()

const router = express.Router()

// constants
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1'
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'exampleSecretKey123'

// unprotected route
router.get('/', (req, res) => {
  res.send('Home')
})

// login
router.post('/login', (req, res) => {
  // TODO: verify user exists on database
  if(typeof req.body.username === 'undefined') return res.sendStatus(422)

  // payload to serialize within token
  const user = {
    userid: 1,
    username: req.body.username
  }
  // create access token
  jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn:'5m' },  (err, accessToken) => {
    if(err) return res.sendStatus(422)
    // return created token
    res.json({accessToken})
  })  
})

// protected route
router.post('/protected', verifyToken, (req, res) => {
  res.send(req.user)
})

// verify token and attach decoded data to request
function verifyToken(req, res, next) {
  // get token
  const authHeader = req.headers['authorization']
  const accessToken = authHeader && authHeader.split(' ')[1]

  // no authentication token provided
  if(accessToken == null) return res.sendStatus(401)

  // verify token
  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
    // unable to verify token
    if(err) return res.sendStatus(401)
    // make decoded payload available at req.user
    req.user = decoded
    next()
  }) 
}

// parse incoming requests with JSON
app.use(express.json())
// parse incoming requests with urlencoded
app.use(express.urlencoded({extended: false}))
// routes at the end to allow previous middleware to act
app.use(router)

//start
app.listen(PORT, HOST, () => console.log(`Listening on http://${HOST}:${PORT}`))
