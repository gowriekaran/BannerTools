var playCount = 1;
var autoPlay, interval;
var intervalIsRunning = true;

if (localStorage['uniqueID_checkpoint']) {
    banner.myTL.progress(localStorage['uniqueID_checkpoint']);
    $("#_BT_checkPoint").html("Checkpoint: " + banner.myTL.time() + "s");
}

$("#_BT_currentTime").dblclick(function () {
    localStorage['uniqueID_checkpoint'] = banner.myTL.progress();
    $("#_BT_checkPoint").html("Checkpoint: " + banner.myTL.time() + "s");
});

$("#_BT_checkPoint").dblclick(function () {
    localStorage.removeItem('uniqueID_checkpoint');
    $("#_BT_checkPoint").html("");
});

if (typeof banner != "undefined") {
    autoPlay = banner.myTL.repeat() + 1;
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

            if (!intervalIsRunning) {
                intervalIsRunning = true;
                interval = setInterval(animationInterval, 0);
            }
        }
    });
    // Get total duration
    $("#_BT_adTotalDurationLabel").html("Total time: " + formatNumber(banner.myTL.totalDuration()) + "s");
    if (banner.myTL.totalDuration() > 30) {
        $("#_BT_adTotalDurationLabel").addClass("._BT_warning");
    }

    // Get duration
    $("#_BT_adDurationLabel").html(banner.myTL.duration().toString().substring(0, 4) + "s");
    if (banner.myTL.duration() > 30) {
        $("#_BT_adDurationLabel").addClass("._BT_warning");
    }

    // Get replay count
    if ((banner.myTL.repeat() + 1) == 1) {
        $("#_BT_adPlaying").html(" once");
    }
    else if ((banner.myTL.repeat() + 1) == 2) {
        $("#_BT_adPlaying").html(" twice");
    }
    else {
        $("#_BT_adPlaying").html(banner.myTL.repeat() + 1 + " times");
    }
}
else {
    console.log("BannerTools could not find Banner object, Object Hijack task aborted");
}

function animationInterval() {
    $("#slider").slider("value", banner.myTL.progress() * 100);
    $("#_BT_currentTime").html(formatNumber(banner.myTL.time()) + "s");
    if (banner.myTL.progress() == 1) {
        playCount++;

        if (playCount > autoPlay) {
            intervalIsRunning = false;
            stopInterval(interval);
        }
        else {
            banner.myTL.progress(0);
        }
    }
}

function stopInterval(interval) {
    clearInterval(interval);
}

function formatNumber(arg) {
    return arg.toString().substring(0, 4);
}