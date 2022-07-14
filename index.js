const express = require('express')
const app = express()
const port = 8000
require("./models/dbConfig")

app.listen(port, () => {
    console.log("Server Started :\n","https://localhost:"+port)
})