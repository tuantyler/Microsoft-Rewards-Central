let phone = false
chrome.runtime.onStartup.addListener(() => {
    var lastRun = localStorage.getItem('MSRC_lastRun')
    var currentDate = new Date().toDateString()
    if (lastRun !== currentDate) {
        chrome.runtime.sendMessage({functionName: 'startAutomationRedeem', args: []});
        localStorage.setItem("MSRC_lastestTimeRedeem" , new Date().toLocaleString('vi-VN'))
        localStorage.setItem("MSRC_lastRun", currentDate)
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