require('dotenv').config()
const crypto = require('crypto')
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

// sample user data
const users = [
  { id:1, username: 'testuser', password: 'someHashedPassword', accessTokenSecret: ''},
  { id:2, username: 'anotheruser', password: 'anotherHashedPassword', accessTokenSecret: ''}
]

// login
router.post('/login', (req, res) => {
  // TODO: verify and validate user from database
  const user = users.find(user => user.username === req.body.username)
  if(user == null) return res.sendStatus(422)

  // generate personal key which will be half of the secret used to sign token
  const accessTokenSecret = crypto.randomBytes(32).toString('hex')
  // TODO: save the secretKey in database
  user.accessTokenSecret = accessTokenSecret

  // payload to serialize within token
  const payload = {
    userid: user.id,
    username: user.username
  }

  // combination of personal secret + app wide secret
  secretKey = accessTokenSecret + ACCESS_TOKEN_SECRET

  // create access token
  jwt.sign(payload, secretKey, { expiresIn:'1h' },  (err, accessToken) => {
    if(err) return res.sendStatus(422)
    // return created token
    res.json({accessToken})
  })  
})

// remove personal secret
router.post('/logout', verifyToken, (req, res) => {
  // TODO: find user in db
  const user = users.find(user => user.id === req.user.userid)
  if(user == null) return res.sendStatus(422)

  // TODO: empty accessTokenSecret in db
  user.accessTokenSecret = '' 
  return res.status(200).json({ message: 'Logged out' })
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

  // get user id from payload
  const userid = jwt.decode(accessToken).userid
  // TODO: verify user exists on a database
  const user = users.find(user => user.id === userid)
  if(user == null) return res.sendStatus(422)

  // combination of personal key + app wide
  secretKey = user.accessTokenSecret + ACCESS_TOKEN_SECRET

  // verify token
  jwt.verify(accessToken, secretKey, (err, decoded) => {
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
app.listen(3000, () => console.log(`Listening on http://${HOST}:${PORT}`))
