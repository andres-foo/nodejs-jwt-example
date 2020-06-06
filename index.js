require('dotenv').config()
const express = require('express')
const app = express()

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Working')
})

app.use(router)

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1' 

app.listen(3000, () => console.log(`Listening on http://${HOST}:${PORT}`))
