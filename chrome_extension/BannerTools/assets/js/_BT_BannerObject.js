if ((typeof banner == "undefined") && (typeof banner.myTL == "undefined")) {
    console.log("BannerTools could not find Banner object, Object Script will not work");
}

var interval;
var isCheckpointSet = false;

function startup() {
    if (localStorage['uniqueID_checkpoint']) {
        banner.myTL.progress(localStorage['uniqueID_checkpoint']);
        $("#_BT_checkPoint").html("Checkpoint: " + formatNumber(banner.myTL.time()) + "s");
    }

    $("#_BT_adTotalDurationLabel").html("Total time: " + formatNumber(banner.myTL.totalDuration()) + "s");
    if (banner.myTL.totalDuration() > 30) {
        $("#_BT_adTotalDurationLabel").addClass("._BT_warning");
    }

    $("#_BT_adDurationLabel").html(banner.myTL.duration().toString().substring(0, 4) + "s");
    if (banner.myTL.duration() > 30) {
        $("#_BT_adDurationLabel").addClass("._BT_warning");
    }

    if ((banner.myTL.repeat() + 1) == 1) {
        $("#_BT_adPlaying").html(" once");
    }
    else if ((banner.myTL.repeat() + 1) == 2) {
        $("#_BT_adPlaying").html(" twice");
    }
    else {
        $("#_BT_adPlaying").html(banner.myTL.repeat() + 1 + " times");
    }

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

function firstFrame(){
    banner.myTL.progress(0);
    interval = setInterval(animationInterval, 1);
    sliderInterval();
}

function lastFrame(){
    banner.myTL.progress(100);
    sliderInterval();
}

function sliderInterval(){
    $("#slider").slider("value", banner.myTL.progress() * 100);
    $("#_BT_currentTime").html(banner.myTL.time().toString().substring(0,5) + "s");
    stopInterval();
}

function playAnimation() {
    banner.myTL.play();
}

function pauseAnimation() {
    banner.myTL.pause();
}

function checkpoint() {
    console.log("isCheckpointSet", isCheckpointSet);
    if(!isCheckpointSet){
        if (localStorage['uniqueID_checkpoint']) {
            banner.myTL.progress(localStorage['uniqueID_checkpoint']);
        }
        else {
            localStorage['uniqueID_checkpoint'] = banner.myTL.progress();
        }
        console.log(localStorage['uniqueID_checkpoint']);
        $("#_BT_checkPoint").html("Checkpoint: " + formatNumber(banner.myTL.time()) + "s");
        isCheckpointSet = true;
    }
    else {
        localStorage.removeItem('uniqueID_checkpoint');
        $("#_BT_checkPoint").html("");
        isCheckpointSet = false;
    }
}

function boost(arg) {
    banner.myTL.timeScale(arg);
}

function animationInterval() {
    $("#slider").slider("value", banner.myTL.progress() * 100);
    $("#_BT_currentTime").html(formatNumber(banner.myTL.time()) + "s");
    if (banner.myTL.progress() == 1) {
        if (banner.played == 1) {
            stopInterval();
        }
        else {
            stopInterval();
            interval = setInterval(animationInterval, 1);
        }
    }
}

function stopInterval() {
    clearInterval(interval);
}

function formatNumber(arg) {
    return arg.toString().substring(0, 4);
}

function adSize() {
    var _BT_adSize = "(" + banner.adWidth + " x " + banner.adHeight + ")";
    $("#_BT_adNowPlaying").text(document.title.split('-')[0] + _BT_adSize);
    localStorage["adWidth"] = banner.adWidth;
    localStorage["adHeight"] = banner.adHeight;
}