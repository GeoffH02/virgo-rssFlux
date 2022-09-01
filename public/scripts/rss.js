window.onload = () => {
    const socket = io()
    let coindesk = "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml"
    let coinnews = "https://www.coinnews.fr/feed"
    let cointelegraph = "https://cointelegraph.com/rss"
    let newsBTC = "https://www.newsbtc.com/feed/"
    let ambcCrypto = "https://ambcrypto.com/feed/"
    let bitcoinist = "https://bitcoinist.com/feed/"
    let coingape = "https://coingape.com/feed/"

    let urlList = [coindesk,coinnews,cointelegraph,newsBTC,ambcCrypto,bitcoinist,coingape]

    for (let ir = 0; ir < urlList.length; ir++ ){

        console.log(urlList[ir])
        checkRes(urlList[ir])
    }



    let arrNews = []
    let content = document.querySelector(".content")

    let jsonfile = {
        "tokens": [{
            "Bitcoin": {
                "id": 1,
                "Articles": 3,
                "lastFetch": 13.37,
                "linkToArticles": []
            },
            "Ethereum": {
                "id": 2,
                "Articles": 3,
                "lastFetch": 13.37,
                "linkToArticles": []

            },
            "BNB": {
                "id": 2,
                "Articles": 3,
                "lastFetch": 13.37,
                "linkToArticles": []

            },
            "Virgo": {
                "id": 3,
                "Articles": 3,
                "lastFetch": 13.37,
                "linkToArticles": []
            },
            "NFT": {
                "id": 3,
                "Articles": 3,
                "lastFetch": 13.37,
                "linkToArticles": []
            }
        }]
    };

    function checkRes(url) {

        $.ajax({
            type: 'GET',
            url: "https://api.rss2json.com/v1/api.json?rss_url=" + url,
            dataType: 'jsonp',
            success: function (result) {
                for (let i = 0; i < result.items.length; i++) {
                    let insideDiv = document.createElement("div")
                    let paragraphe = document.createElement("p")
                    let createdAT = document.createElement("p")
                    let imageArticle = document.createElement("img")
                    let linktoBlog = document.createElement("a")


                    let image = imageArticle.src = result.items[i].enclosure.link;
                    let articleLink = linktoBlog.href = result.items[i].link
                    let articleLinkText = linktoBlog.textContent = "Redirect"
                    let title = `${result.items[i].title}`
                    let description =  result.items[i].description

                    var regex = /(<([^>]+)>)/ig
                    let regexed = description.replace(regex, "");

                    console.log(result);
                    let title_split = title.split(' ')

                    for (let i = 0; i < jsonfile.tokens.length; i++) {
                        let obj = jsonfile.tokens[i];
                        let objParse = Object.keys(obj)
                        let resultObj
                        if (title_split.some(isin => {
                            if (objParse.includes(isin)) {
                                 resultObj = isin
                                let findBg = jsonfile.tokens[0][resultObj]
                                let addArticles = findBg.linkToArticles.push(articleLink)
                                console.log(result)
                            }

                            return objParse.includes(isin)

                        })) {
                            let date = result.items[i].pubDate
                            paragraphe.append(title)
                            insideDiv.append(paragraphe)
                            insideDiv.append(createdAT)
                            insideDiv.append(linktoBlog)
                            insideDiv.append(imageArticle)
                            imageArticle.width = 150
                            createdAT.append(date)
                            content.append(insideDiv)

                            const news = {
                                params : {
                                    ticker: resultObj,
                                    title: title,
                                    desc: regexed,
                                    image: image,
                                    link: articleLink,
                                    date: date
                                }
                            }


                            const options = {
                                method: 'POST',
                                body: JSON.stringify({ok: "ok"})
                            };

                            fetch("/emitNews",options)
                                .then( response => response
                                )
                                .then( response => {
                                    console.log(response)
                                } );

/*                            socket.emit('news', {
                                ticker: resultObj,
                                title: title,
                                desc: regexed,
                                image: image,
                                link: articleLink,
                                date: date
                            })*/

                        }

                    }

                }
            }
        });
    }
}
