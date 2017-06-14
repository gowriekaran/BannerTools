$(document).ready(function () {
    chrome.extension.sendRequest({
        cmd: "_BT_get_BT_settings"
    }, function (html) {
        $("#options").append(html);
        chrome.storage.sync.get(null, function (items) {
            if (items["_BT_adContainer"]) {
                _BT_adContainer = items["_BT_adContainer"];
                $("#_BT_adContainer").val(_BT_adContainer);
            }
            if (items["_BT_replayButton"]) {
                _BT_replayButton = items["_BT_replayButton"];
                $("#_BT_replayButton").val(_BT_replayButton);
            }
            if (items["_BT_timeline"]) {
                _BT_timeline = items["_BT_timeline"];
                $("#_BT_timeline").val(_BT_timeline);
            }
        });

        $("#_BT_settingsSaveButton").click(function () {
            if ($("#_BT_adContainer").val()) {
                setToStorage({ "_BT_adContainer": $("#_BT_adContainer").val() });
            }
            if ($("#_BT_replayButton").val()) {
                setToStorage({ "_BT_replayButton": $("#_BT_replayButton").val() });
            }
             if ($("#_BT_timeline").val()) {
                setToStorage({ "_BT_timeline": $("#_BT_timeline").val() });
            }

            location.reload();
        });

        $("#_BT_resetButton").click(function () {
            chrome.storage.sync.clear();
            chrome.storage.local.clear();
            localStorage.clear();
            location.reload();
        });

        $(window).keypress(function (e) {
            switch (e.keyCode) {
                case 13: $("#_BT_settingsSaveButton").click();
                break;
            }
        });

        function setToStorage(obj) {
            chrome.storage.sync.set(obj);
        }
    });
});