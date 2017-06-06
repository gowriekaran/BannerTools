$(document).ready(function () {
    $("head").append('<script type="text/javascript" src="https://h5.adgear.com/v1/js/loaders/basic.min.js"></script>');
    $("body").append('<div id="_BT_AdGearHomeButton"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"/></svg></div>');
    $("body").append('<img id="_BT_AdGearLogoButton" src="' + chrome.extension.getURL('/assets/img/adgear2.png') + '"/>');
    $("body").append('<input type="text" id="_BT_AdGearURLInput" placeholder="https://www.google.com"><button id="_BT_AdGearURLButton">Update CTA</button>');
    $("body").append('<div id="_BT_AdGearPreviewContainer"><iframe id="_BT_AdGearPreview" src="about:blank;" width="' + localStorage["adWidth"] + '" height="' + localStorage["adHeight"] + '" frameborder="0" scrolling="no"></iframe></div>');

    $("#ad-container").remove();
    $("#_BT_AdGearLogoButton, #_BT_AdGearHomeButton").click(function () {
        setToGoogleStorage({ "isAdGear": 0 });
        location.reload();
    });

    $('input').blur(function () {
        reloadAdgear();
    });

    $('button').click(function () {
        reloadAdgear();
    });

    $(window).keypress(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            reloadAdgear();
        }
    });

    function reloadAdgear() {
        console.log($("#_BT_AdGearURLInput").val());
        localStorage["AdGearURLInput"] = $("#_BT_AdGearURLInput").val();
        location.reload();
    }

    $("#_BT_AdGearURLInput").val("https://www.google.com");
    if (localStorage["AdGearURLInput"]) {
        $("#_BT_AdGearURLInput").val(localStorage["AdGearURLInput"]);
    }
    var banner_url = window.location.href;
    var width = _BT_adWidth;
    var height = _BT_adHeight;

    var loader_obj = {};
    loader_obj['width'] = _BT_adWidth;
    loader_obj['height'] = _BT_adHeight;

    // Click URLs
    loader_obj['click_urls'] = {};
    loader_obj['click_urls']['clickTAG'] = $("#_BT_AdGearURLInput").val();

    // // Expandable
    // loader_obj['expandable'] = {};
    // loader_obj['expandable']['direction'] = 'bl';
    // loader_obj['expandable']['width'] = 600;
    // loader_obj['expandable']['height'] = 300;
    $(document).ready(function () {
        setTimeout(function () { ADGEAR.html5.basicLoader("_BT_AdGearPreview", banner_url, loader_obj); }, 250);
    });
});