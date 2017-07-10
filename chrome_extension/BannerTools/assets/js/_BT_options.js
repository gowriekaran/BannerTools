$(document).ready(function () {
    $("#_BT_resetButton").click(function () {
        chrome.storage.sync.clear();
        chrome.storage.local.clear();
        localStorage.clear();
        location.reload();
        window.close();
    });
});