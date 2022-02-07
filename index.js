const express = require('express')
const app = express()
const port = 5000
const connect = require('./config')
const routes = require('./routes')

connect()

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