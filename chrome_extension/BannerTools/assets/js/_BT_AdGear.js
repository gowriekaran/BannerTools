$(document).ready(function () {
    var banner_url = window.location.href;

    var loader_obj = {};
    loader_obj['width'] = localStorage["_BT_adWidth"];
    loader_obj['height'] = localStorage["_BT_adHeight"];

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