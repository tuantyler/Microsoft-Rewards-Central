let phone = false
chrome.runtime.onMessage.addListener(function(request) {
    request.req_flag == "PHONE_MODE_ON" ? phone = true : phone = false
});
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