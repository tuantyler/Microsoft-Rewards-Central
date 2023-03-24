chrome.runtime.sendMessage({req_flag: "PHONE_MODE_OFF"})
fetch('https://rewards.bing.com/api/getuserinfo?type=1').then(response => response.json()).then(data => {
    document.getElementById("availablePoints").innerHTML = data.dashboard.userStatus.availablePoints
    document.getElementById("todayPoints").innerHTML = data.dashboard.userStatus.counters.dailyPoint[0].pointProgress
    document.getElementById("pcSearch").innerHTML = data.dashboard.userStatus.counters.pcSearch[0].pointProgress + "/" + data.dashboard.userStatus.counters.pcSearch[0].pointProgressMax
    document.getElementById("edgeSearch").innerHTML = data.dashboard.userStatus.counters.pcSearch[1].pointProgress + "/" + data.dashboard.userStatus.counters.pcSearch[1].pointProgressMax
    document.getElementById("mobileSearch").innerHTML = data.dashboard.userStatus.counters.mobileSearch[0].pointProgress + "/" + data.dashboard.userStatus.counters.mobileSearch[0].pointProgressMax
    document.getElementById("MSRC_lastestTimeRedeem").innerHTML = localStorage.getItem('MSRC_lastestTimeRedeem')
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.functionName === 'startAutomationRedeem') {
        searchPCRecursion(generateRandomQueries(50,5,20) , 0)
    }
})

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
        chrome.runtime.sendMessage({req_flag: "PHONE_MODE_OFF"})
        document.getElementById("btnRedeem").innerHTML = '<i class="fa fa-check" aria-hidden="true"></i> Done'
        return
    } 
    document.getElementById("btnRedeem").innerHTML = '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Redeem mobile searching ' + (index + 1)  + '...'
    await fetch("https://www.bing.com/search?q=" + encodeURIComponent(queries[index]) + "&PC=OPALIOS&form=LWS001&ssp=1&cc=VN&setlang=en&darkschemeovr=1&safesearch=moderate").then(response => response).then(data => {
        searchMobileRecursion(queries, index+1)
    })
}

async function searchPCRecursion(queries , index){
    console.log(index)
    if (index >= queries.length) {
        chrome.runtime.sendMessage({req_flag: "PHONE_MODE_ON"})
        searchMobileRecursion(generateRandomQueries(50,5,20) , 0)
        return
    }
    document.getElementById("btnRedeem").innerHTML = '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Redeem searching ' + (index + 1)  + '...'
    await fetch("https://www.bing.com/search?q=" + encodeURIComponent(queries[index])).then(response => response).then(data => {
        searchPCRecursion(queries, index+1)
    })
}
document.getElementById("btnRedeem").addEventListener("click", function (e) {
    searchPCRecursion(generateRandomQueries(50,5,20) , 0)
    document.getElementById("btnRedeem").innerHTML = '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Starting...'
    document.getElementById("btnRedeem").innerHTML = '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Redeem searching...'
})


