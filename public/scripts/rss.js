window.onload = () => {
    let coindesk = "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml"
    let coinnews = "https://www.coinnews.fr/feed"
    let arrNews = []
    let content = document.querySelector(".content")

    let jsonfile = {
        "tokens": [{
            "BTC": {
                "id": 1,
                "Articles": 3,
                "lastFetch": 13.37,
                "linkToArticles": []
            },
            "ETH": {
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


    $.ajax({
        type: 'GET',
        url: "https://api.rss2json.com/v1/api.json?rss_url=" + coindesk,
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
                let title_split = title.split(' ')

                for (let i = 0; i < jsonfile.tokens.length; i++) {
                    let obj = jsonfile.tokens[i];
                    let objParse = Object.keys(obj)

                    if (title_split.some(isin => objParse.includes(isin))){

                        paragraphe.append(title)
                        insideDiv.append(paragraphe)
                        insideDiv.append(createdAT)
                        insideDiv.append(linktoBlog)
                        insideDiv.append(imageArticle)
                        imageArticle.width = 150
                        createdAT.append(result.items[i].pubDate)
                        content.append(insideDiv)
/*
                        obj.linkToArticles = obj.linkToArticles + articleLink
*/
                        console.log(obj)
                    }

                }



                /*console.log(title.split(' '))*/
            }
        }
    });


    $.ajax({
        type: 'GET',
        url: "https://api.rss2json.com/v1/api.json?rss_url=" + coinnews,
        dataType: 'jsonp',
        success: function (result) {
            for (let i = 0; i < result.items.length; i++) {
                console.log(result)
                let insideDiv = document.createElement("div")
                let paragraphe = document.createElement("p")
                let createdAT = document.createElement("p")
                let imageArticle = document.createElement("img")
                let linktoBlog = document.createElement("a")
                let image = imageArticle.src = result.items[i].enclosure.link;
                createdAT.append(result.items[i].pubDate)
                let articleLink = linktoBlog.href = result.items[i].link
                let articleLinkText = linktoBlog.textContent = "Redirect"
                imageArticle.width = 150
                let title = `${result.items[i].title}`
                paragraphe.append(title)
                insideDiv.append(paragraphe)
                insideDiv.append(createdAT)
                insideDiv.append(linktoBlog)
                insideDiv.append(imageArticle)
            }
        }
    });
}
