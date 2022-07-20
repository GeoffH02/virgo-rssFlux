const express = require('express')
const sqlite = require('sqlite3')
const fs = require('fs')
const path = require("path")
const app = express()
const port = 5655
const dbName = 'virgo_api.db'

app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "public/scripts")))

/*let db = new sqlite.Database(dbName, err => {
    if (err) throw err

    db.run('CREATE TABLE news(name VARCHAR(255))')

    db.run('INSERT INTO news VALUES(?)',['Teste'])


    db.get('SELECT * FROM news', (err,data) =>{
        if (err) throw err
        console.log(data)
    })

    console.log("Base de donées op")
})*/

app.listen(port, () => {
    console.log("Server Started :\n","http://localhost:"+port +"/")
})


fs.readFile('config.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

/*
db.close(err => {
    if (err) throw  err
    console.log("Base de données fermé")
})*/
