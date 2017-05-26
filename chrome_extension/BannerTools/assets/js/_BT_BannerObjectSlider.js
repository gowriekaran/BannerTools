var interval;

if (typeof banner != "undefined") {
    interval = setInterval(animationInterval, 1);

    $(function () {
        $("#slider").slider();
    });

    $("#slider").slider({
        range: 'min',
        min: 0,
        max: 100,
        step: .1,
        slide: function (event, ui) {
            banner.myTL.progress(ui.value / 100);
            $("#_BT_currentTime").html(formatNumber(banner.myTL.time()) + "s");

            if (typeof interval == 'undefined') {
                interval = setInterval(animationInterval, 0);
            }
        }
    });
}
else {
    console.log("BannerTools could not find Banner object, Object Slider task aborted");
}

function animationInterval() {
    $("#slider").slider("value", banner.myTL.progress() * 100);
    $("#_BT_currentTime").html(formatNumber(banner.myTL.time()) + "s");
    if (banner.myTL.progress() == 1) {
        if (banner.played == 1) {
            stopInterval(interval);
        }
        else {
            stopInterval(interval);
            interval = setInterval(animationInterval, 1);
        }
    }
}

function stopInterval(interval) {
    clearInterval(interval);
}

function formatNumber(arg) {
    return arg.toString().substring(0, 4);
}