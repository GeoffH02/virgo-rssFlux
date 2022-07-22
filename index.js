const express = require('express')
const sqlite = require('sqlite3')
const path = require("path")
const app = express()
const port = 5655
const dbName = 'virgo_api.db'

const http = require("http").createServer(app)
const io = require("socket.io")(http)

app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "public/scripts")))





app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})


io.on("connection", (socket) => {
    console.log("Connexion établie")


    let db = new sqlite.Database(dbName, err => {
        if (err) throw err
        db.run('CREATE TABLE IF NOT EXISTS news(ticker,news_title,news_desc,news_img,news_link,pub_date)')
        console.log("Base de donées op")
    })

    socket.on("news",(data) => {
        console.log(data)
        db.run('INSERT INTO news(ticker,news_title,news_desc,news_img,news_link,pub_date) VALUES(?,?,?,?,?,?)',[data.ticker,data.title,data.desc,data.image,data.link,data.date])
/*        db.close(err => {
            if (err) throw  err
            console.log("Base de données fermé")
        })*/
    })

})



http.listen(port, function () {
    console.log("Server Started :\n", "http://localhost:" + port + "/")
})





