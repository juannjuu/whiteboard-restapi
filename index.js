require('dotenv').config();
const express = require('express')
const cors = require('cors')
const passport = require('passport')
const app = express()
const port = process.env.PORT || 5000
const connect = require('./config')
const routes = require('./routes')

connect()
app.use(cors())
app.use(express.json())
app.use("/api/v1", routes)

app.get('/', (req, res) => {
    res.status(200).json({
        "message": "OK"
    })
})

app.listen(port, () => {
    console.log('Server is running at port ', port)
})
