const express = require('express')
const sqlite = require('sqlite3')
const path = require("path")
const app = express()
const port = 3002
const dbName = 'virgo_api.db'
const {parse} = require('rss-to-json');

let fetchedSite = []
let tokensData = []
ok = 0

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
    db.run('CREATE TABLE IF NOT EXISTS news(ticker,news_title,news_desc,news_img,news_link,pub_date,adress)')
    db.run('CREATE TABLE IF NOT EXISTS tokens(name,ticker,website,description,contract,decimals,CG_ID,alias,PRIMARY KEY (`contract`))')

})
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get('/emitNews', (req, res) => {

    fetch("https://virgo.net/api/news/sites.json")
        .then(response => response.json())
        .then(json => {
                let fetchedData = json
                let image = ""

                db.all('SELECT * FROM tokens', function (err, res) {
                    tokensData.push(res)

                })

                for (const site of fetchedData) {
                    fetchedSite.push(site.url)
                    parse(site.url).then(rss => {
                        JSON.stringify(rss, null, 3)
                        for (let i = 0; i < rss.items.length; i++) {
                            let title = rss.items[i].title
                            let itemLink = rss.items[i].link
                            let description = ""
                            if (site.url !== 'https://www.coinnews.fr/feed') {
                                description = rss.items[i].description

                            } else {
                                description = rss.items[i].content
                            }

                            let published = rss.items[i].published

                            var regex = /(<([^>]+)>)/ig
                            let regexed = description.replace(regex, "");


                            if (Object.entries(rss.items[i].media).length > 0) {
                                image = rss.items[i].media.thumbnail.url
                            } else {
                                image = "Mettre une image par default ici"
                            }


                            for (const ticker of tokensData) {

                                for (let l = 0; l < tokensData[0].length; l++) {
                                    console.log(tokensData[0][l].alias)

                                    if (description.includes(tokensData[0][l].name) || description.includes(tokensData[0][l].ticker)  ) {
                                        let tokenName = tokensData[0][l].name
                                        let tokenContract = tokensData[0][l].contract
                                        db.run('INSERT INTO news(ticker,news_title,news_desc,news_img,news_link,pub_date,adress) VALUES(?,?,?,?,?,?,?)', [tokenName, title, regexed, image, itemLink, published, tokenContract])
                                    }
                                }
                            }
                        }
                    });

                }
            }
        )
})

app.get('/github/fetchTokens', (req, res) => {

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
                            fetch("https://raw.githubusercontent.com/virgoproject/tokens/main/" + individualChain + "/" + token + "/infos.json")
                                .then(response => {
                                    if (response.ok) {
                                        response.json()
                                            .then(data => {
                                                console.log(data)
                                                db.run('REPLACE INTO tokens(name,ticker,website,description,contract,decimals,CG_ID,alias) VALUES(?,?,?,?,?,?,?,?)', [data.name, data.ticker, data.website, data.description, data.contract, data.decimals, data.CG_ID,data.alias])

                                            });
                                    }
                                })

                        }
                    })
            }
        })
})


app.get('/api/news/0x2170ed0880ac9a755fd29b2688956bd959f933f8/1',(req,res) =>{
    let adress = "0x2170ed0880ac9a755fd29b2688956bd959f923f8"
    let page = 1
    let articleperpage = 5
    db.all('SELECT * FROM news WHERE adress = ? ORDER BY pub_date DESC LIMIT  ? OFFSET  ?',adress,articleperpage,(articleperpage*(page-1)), function (err,res) {
        console.log(res.length)
        if (res.length <= 0){
            db.all('SELECT * FROM news ORDER BY pub_date DESC LIMIT  ? OFFSET  ?',articleperpage,(articleperpage*(page-1)),function (err,res){
                console.log(res)
            })
        }

    })



})

http.listen(port, function () {
    console.log("Server Started :\n", "http://localhost:" + port + "/")
})
