var bgPage = chrome.extension.getBackgroundPage()
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
function MSRA_inProcess(){
    document.getElementById("btnRedeem").disabled = true
    document.getElementById("btnRedeem").innerHTML = '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> Auto redeem in process...'
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
if (JSON.parse(localStorage.getItem("MSRA_inProcess"))) {
    MSRA_inProcess()
}
document.getElementById("btnRedeem").addEventListener("click", function (e) {
    chrome.runtime.sendMessage({req_flag: "MSRA_reDeem"})
    MSRA_inProcess()
})
