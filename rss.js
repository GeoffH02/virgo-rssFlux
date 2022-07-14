window.onload = () =>{
    let coindesk = "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml"
    let coinnews = "https://www.coinnews.fr/feed"
    let content = document.querySelector(".content")

    $.ajax({
        type: 'GET',
        url: "https://api.rss2json.com/v1/api.json?rss_url=" + coindesk,
        dataType: 'jsonp',
        success: function(result) {
            for(let i = 0;i < result.items.length;i++){
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
                content.append(insideDiv)
            }
        }
    });


    $.ajax({
        type: 'GET',
        url: "https://api.rss2json.com/v1/api.json?rss_url=" + coinnews,
        dataType: 'jsonp',
        success: function(result) {
            for(let i = 0;i < result.items.length;i++){
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
                content.append(insideDiv)
            }
        }
    });


}

