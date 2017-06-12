$(document).ready(function () {
    chrome.storage.sync.get(null, function (items) {
        if (items["_BT_adContainer"]) {
            _BT_adContainer = items["_BT_adContainer"];
            $("#_BT_adContainer").val(_BT_adContainer);
        }
        if (items["_BT_replayButton"]) {
            _BT_replayButton = items["_BT_replayButton"];
            $("#_BT_replayButton").val(_BT_replayButton);
        }
    });

    $("#_BT_settingsSaveButton").click(function () {
        if ($("#_BT_adContainer").val()) {
            setToStorage({ "_BT_adContainer": $("#_BT_adContainer").val() });
        }
        if ($("#_BT_replayButton").val()) {
            setToStorage({ "_BT_replayButton": $("#_BT_replayButton").val() });
        }

        alert("Reload your development tabs");
    });

    function setToStorage(obj) {
        chrome.storage.sync.set(obj);
    }
});