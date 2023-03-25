chrome.runtime.sendMessage({req_flag: "PHONE_MODE_OFF"})
function getTimeLeft() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const threeAM = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 3);
    const threeAMTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 3);
    let timeDifference
    now < threeAM ? timeDifference = threeAM - now : timeDifference = threeAMTomorrow - now 
    const seconds = Math.floor(timeDifference / 1000) % 60;
    const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}
setInterval(function() {
    document.getElementById("MSRA_wait").innerHTML = getTimeLeft()
}, 1000)
document.getElementById("MSRA_lastRun").innerHTML = new Date(localStorage.getItem("MSRA_lastRun")).toLocaleString("vi-VN")

fetch('https://rewards.bing.com/api/getuserinfo?type=1').then(response => response.json()).then(data => {
    document.getElementById("availablePoints").innerHTML = data.dashboard.userStatus.availablePoints
    document.getElementById("todayPoints").innerHTML = data.dashboard.userStatus.counters.dailyPoint[0].pointProgress
    document.getElementById("pcSearch").innerHTML = data.dashboard.userStatus.counters.pcSearch[0].pointProgress + "/" + data.dashboard.userStatus.counters.pcSearch[0].pointProgressMax
    document.getElementById("edgeSearch").innerHTML = data.dashboard.userStatus.counters.pcSearch[1].pointProgress + "/" + data.dashboard.userStatus.counters.pcSearch[1].pointProgressMax
    typeof data.dashboard.userStatus.counters.mobileSearch?.[0].pointProgress === "undefined" ? document.getElementById("mobileSearch").innerHTML = "0/0" : document.getElementById("mobileSearch").innerHTML = data.dashboard.userStatus.counters.mobileSearch[0].pointProgress + "/" + data.dashboard.userStatus.counters.mobileSearch[0].pointProgressMax
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
        chrome.runtime.sendMessage({req_flag: "MSRA_phone"})
        searchMobileRecursion(generateRandomQueries(50,5,20) , 0)
        return
    }
    document.getElementById("btnRedeem").innerHTML = '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Redeem searching ' + (index + 1)  + '...'
    await fetch("https://www.bing.com/search?q=" + encodeURIComponent(queries[index])).then(response => response).then(data => {
        searchPCRecursion(queries, index+1)
    })
}
if (JSON.parse(localStorage.getItem("MSRA_inProcess"))) {
    document.getElementById("btnRedeem").disabled = true
    document.getElementById("btnRedeem").innerHTML = '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Auto redeem in process...'
}
document.getElementById("btnRedeem").addEventListener("click", function (e) {
    searchPCRecursion(generateRandomQueries(50,5,20) , 0)
    localStorage.setItem("MSRA_lastRun", new Date())
    document.getElementById("btnRedeem").disabled = true
    document.getElementById("btnRedeem").innerHTML = '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Starting...'
    document.getElementById("btnRedeem").innerHTML = '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Redeem searching...'
})
document.getElementById("banner").addEventListener("click", function (e) {
    window.open("https://rewards.bing.com/", "_blank");
})    
