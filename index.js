const express = require('express')
const sqlite = require('sqlite3')
const path = require("path")
const app = express()
const port = 3001
const dbName = 'virgo_api.db'

const http = require("http").createServer(app)
const io = require("socket.io")(http)

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept')
    next()
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "public/scripts")))



let db = new sqlite.Database(dbName, err => {
    if (err) throw err
    db.run('CREATE TABLE IF NOT EXISTS news(ticker,news_title,news_desc,news_img,news_link,pub_date)')
})



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post('/emitNews', (req,res) => {
    console.log(req.body,req.query,req.params,req)
})


io.on("connection", (socket) => {
    console.log("Connexion établie")

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



/*
*         SELECT MIN(pub_date),ticker AS MaxRecordID
        FROM news
        GROUP BY ticker,
                 pub_date


select ticker, min(pub_date)
from news
group by ticker, pub_date
HAVING COUNT(*) > 1

SELECT MAX(pub_date)
FROM news
GROUP BY ticker, pub_date
ORDER BY 1 DESC


SELECT * FROM news ORDER BY pub_date DESC

SELECT ticker, pub_date, COUNT(*)
FROM news
GROUP BY ticker, pub_date
HAVING COUNT(*) > 0

DELETE FROM news
WHERE ticker NOT IN (
  SELECT ticker
  FROM (
    SELECT *
    FROM news s1
    WHERE (
        SELECT COUNT(*)
        FROM news s2
        WHERE s1.ticker = s2.ticker
            AND s1.pub_date <= s2.pub_date
    ) <= 5 --Keep this many records
  ) foo
);
*/

