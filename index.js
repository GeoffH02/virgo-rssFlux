const express = require('express')
const sqlite = require('sqlite3')
const path = require("path")
const app = express()
const port = 3001
const dbName = 'virgo_api.db'
const {parse} = require('rss-to-json');

let fetchedSite = []
let dataFlux = []

const http = require("http").createServer(app)


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept')
    next()
})

app.use(express.urlencoded({extended: true}));
app.use(express.json());


let db = new sqlite.Database(dbName, err => {
    if (err) throw err
    db.run('CREATE TABLE IF NOT EXISTS news(ticker,news_title,news_desc,news_img,news_link,pub_date)')
    db.run('CREATE TABLE IF NOT EXISTS tokens(name,ticker,website,description,contract,decimals,CG_ID)')


})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get('/emitNews', (req, res) => {
    fetch("https://virgo.net/api/news/sites.json")
        .then(response => response.json())
        .then(json => {
                let fetchedData = json

                for (const site of json) {
                    console.log(site)
                    fetchedSite.push(site.url)
                    parse(site.url).then(rss => {
                        dataFlux.push(JSON.stringify(rss, null, 3))
                        console.log(dataFlux.length)
                    });

                }

                for (let i = 0; i < dataFlux.length; i++) {
                    console.log(dataFlux)
                }
            }
        )
})

app.get('/fetchNews', (req, res) => {


    let repoFetch = "https://raw.githubusercontent.com/virgoproject/tokens/main/infos.json"
    fetch(repoFetch)
        .then(result => result.json())
        .then(json => {
            let chains = json.chains
            let parseArray = []

            for (const individualChain of chains) {
                console.log(individualChain)
                let chainParsed = "https://raw.githubusercontent.com/virgoproject/tokens/main/" + individualChain + "/infos.json"
                fetch(chainParsed)
                    .then(jsonPArsed => jsonPArsed.json())
                    .then(json => {
                        for (const token of json.tokens) {
                            if (individualChain !== "AVAX" || individualChain !== "CRO" || individualChain !== "AVAX" || individualChain !== "HT" || individualChain !== "KCS"   )
                                fetch("https://raw.githubusercontent.com/virgoproject/tokens/main/" + individualChain + "/" + token + "/infos.json")
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(data.name)
                                        db.run('INSERT INTO tokens(name,ticker,website,description,contract,decimals,CG_ID) VALUES(?,?,?,?,?,?,?)',[data.name,data.ticker,data.website,data.description,data.contracts,data.decimals,data.CG_ID])

                                    });
                        }

                    })
            }
        })
})

http.listen(port, function () {
    console.log("Server Started :\n", "http://localhost:" + port + "/")
})
