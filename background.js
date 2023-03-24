let phone = false
localStorage.setItem("MSRC_autoRedeemInProcess" , false)
function generateRandomQueries(numQueries, minLength, maxLength) {
    var queries = []
    var words = ["apple", "banana", "orange", "pineapple", "grape", "peach", "pear", "watermelon", "melon", "kiwi", "mango", "strawberry", "blueberry", "raspberry", "blackberry", "cherry", "plum", "apricot", "nectarine", "fig"]

    for (var i = 0 ;i < numQueries ; i++) {
        var query = ""
        while (query === "" || queries.includes(query)) {
            var length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
            query = words[Math.floor(Math.random() * words.length)]
            for (var j = 1 ;j < length ;j++) {
                query += " " + words[Math.floor(Math.random() * words.length)]
            }
        }
        queries.push(query)
    }
    return queries
}
async function searchMobileRecursion(queries , index){
    if (index >= queries.length) {
        phone = false
        localStorage.setItem("MSRC_autoRedeemInProcess" , false)
        return
    } 
    await fetch("https://www.bing.com/search?q=" + encodeURIComponent(queries[index]) + "&PC=OPALIOS&form=LWS001&ssp=1&cc=VN&setlang=en&darkschemeovr=1&safesearch=moderate").then(response => response).then(data => {
        searchMobileRecursion(queries, index+1)
    })
}
async function searchPCRecursion(queries , index){
    if (index >= queries.length) {
        phone = true
        searchMobileRecursion(generateRandomQueries(50,5,20) , 0)
        return
    }
    await fetch("https://www.bing.com/search?q=" + encodeURIComponent(queries[index])).then(response => response).then(data => {
        searchPCRecursion(queries, index+1)
    })
}
function isMoreThan24Hours(dateString1, dateString2) {
    var date1 = new Date(dateString1);
    var date2 = new Date(dateString2);
    var difference = Math.abs(date1.getTime() - date2.getTime());
    var hours = difference / 3600000;
    return hours > 24;
}
chrome.runtime.onStartup.addListener(() => {
    var lastRun = localStorage.getItem('MSRC_lastRun')
    var currentDate = new Date()
    if (isMoreThan24Hours(currentDate,lastRun)) {
        localStorage.setItem("MSRC_autoRedeemInProcess" , true)
        localStorage.setItem("MSRC_lastestTimeRedeem" , new Date())
        localStorage.setItem("MSRC_lastRun", currentDate)
        searchPCRecursion(generateRandomQueries(50,5,20) , 0)
    }
})
chrome.runtime.onMessage.addListener(function(request) {
    request.req_flag == "PHONE_MODE_ON" ? phone = true : phone = false
})
chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
    for(var i=0; i < details.requestHeaders.length; ++i){
        if(details.requestHeaders[i].name === "User-Agent"){
            details.requestHeaders[i].value = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.51"
        }
        if(details.requestHeaders[i].name === "Host"){
            details.requestHeaders[i].value = "rewards.bing.com"
        }
        if(details.requestHeaders[i].name === "Referer"){
            details.requestHeaders[i].value = "https://rewards.bing.com/?signin=1&pc=U523"
        }
    }
    return {requestHeaders: details.requestHeaders};
}, {urls: ["*://rewards.bing.com/*"]}, ["blocking", "requestHeaders"])
chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
    if (phone) {
        for(var i=0; i < details.requestHeaders.length; ++i){
            if(details.requestHeaders[i].name === "User-Agent"){
                details.requestHeaders[i].value = "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410307002"
                break
            }
        }
    }
    return {requestHeaders: details.requestHeaders};
}, {urls: ["*://www.bing.com/*"]}, ["blocking", "requestHeaders"])