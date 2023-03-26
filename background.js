let phone = false
chrome.runtime.onMessage.addListener(function(request) {
    if (request.req_flag == "MSRA_reDeem"){
        localStorage.setItem("MSRA_inProcess" , true)
        localStorage.setItem("MSRA_lastRun", new Date())
        searchPCRecursion(generateRandomQueries(50,5,20) , 0)
    } 
})
localStorage.setItem("MSRA_inProcess" , false)

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
        localStorage.setItem("MSRA_inProcess" , false)
        return
    } 
    await fetch("https://www.bing.com/search?q=" + encodeURIComponent(queries[index]) + "&PC=OPALIOS&form=LWS001&ssp=1&cc=VN&setlang=en&darkschemeovr=1&safesearch=moderate")
    searchMobileRecursion(queries, index+1)
}
async function searchPCRecursion(queries , index){
    if (index >= queries.length) {
        phone = true
        searchMobileRecursion(generateRandomQueries(50,5,20) , 0)
        return
    }
    await fetch("https://www.bing.com/search?q=" + encodeURIComponent(queries[index]))
    searchPCRecursion(queries, index+1)
}
function getTimeDifference(dateString) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const threeAM = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 3);
    const inputDate = new Date(dateString);
    return inputDate <= threeAM && now > threeAM
}
chrome.runtime.onStartup.addListener(() => {
    var lastRun = localStorage.getItem('MSRA_lastRun')
    if (getTimeDifference(lastRun)) {
        localStorage.setItem("MSRA_inProcess" , true)
        localStorage.setItem("MSRA_lastRun", new Date())
        searchPCRecursion(generateRandomQueries(50,5,20) , 0)
    }
})
chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
    for(var i=0; i < details.requestHeaders.length; ++i){
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
    for(var i=0; i < details.requestHeaders.length; ++i){
        if (details.requestHeaders[i].name === "User-Agent") {
            phone ? details.requestHeaders[i].value = "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/605.1.15 BingSapphire/1.0.410307002" : details.requestHeaders[i].value = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.51"
        }  
    }
    return {requestHeaders: details.requestHeaders};
}, {urls: ["*://www.bing.com/*"]}, ["blocking", "requestHeaders"])