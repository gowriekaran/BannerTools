$(document).ready(function () {
    $("#_BT_AdGearURL").val("https://www.google.com");
    if (localStorage["AdGearURL"]) {
        $("#_BT_AdGearURL").val(localStorage["AdGearURL"]);
    }
    var banner_url = window.location.href;
    var width = _BT_adWidth;
    var height = _BT_adHeight;

    var loader_obj = {};
    loader_obj['width'] = _BT_adWidth;
    loader_obj['height'] = _BT_adHeight;

    // Click URLs
    loader_obj['click_urls'] = {};
    loader_obj['click_urls']['clickTAG'] = $("#_BT_AdGearURL").val();

    // // Expandable
    // loader_obj['expandable'] = {};
    // loader_obj['expandable']['direction'] = 'bl';
    // loader_obj['expandable']['width'] = 600;
    // loader_obj['expandable']['height'] = 300;
    $(document).ready(function () {
        ADGEAR.html5.basicLoader("_BT_AdGearPreview", banner_url, loader_obj);
    });

    $('input').blur(function () {
        localStorage["AdGearURL"] = $("#_BT_AdGearURL").val();
        location.reload();
    });

    $('button').click(function () {
        localStorage["AdGearURL"] = $("#_BT_AdGearURL").val();
        location.reload();
    });
});