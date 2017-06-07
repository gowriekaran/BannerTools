var interval;
var isCheckpointSet = false;

function isSafe(){
    if ((typeof banner == "undefined") && (typeof banner.myTL == "undefined")) {
        console.log("BannerTools could not find Banner object, Object Script will not work. Try refreshing.");
        return false;
    }
    else{
        return true;
    }
}

function startup() {
    if(!isSafe()){
        return;
    }

    if (localStorage['_BT_checkpoint']) {
        banner.myTL.progress(localStorage['_BT_checkpoint']);
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
    if(!isSafe()){
        return;
    }

    banner.myTL.progress(0);
    interval = setInterval(animationInterval, 1);
    sliderInterval();
}

function lastFrame(){
    if(!isSafe()){
        return;
    }

    banner.myTL.progress(100);
    sliderInterval();
}

function sliderInterval(){
    if(!isSafe()){
        return;
    }

    $("#slider").slider("value", banner.myTL.progress() * 100);
    $("#_BT_currentTime").html(banner.myTL.time().toString().substring(0,5) + "s");
    stopInterval();
}

function playAnimation() {
    if(!isSafe()){
        return;
    }

    banner.myTL.play();
}

function pauseAnimation() {
    if(!isSafe()){
        return;
    }

    banner.myTL.pause();
}

function checkpoint() {
    if(!isSafe()){
        return;
    }

    if(!isCheckpointSet){
        if (localStorage['_BT_checkpoint']) {
            banner.myTL.progress(localStorage['_BT_checkpoint']);
        }
        else {
            localStorage['_BT_checkpoint'] = banner.myTL.progress();
        }
        $("#_BT_checkPoint").html("Checkpoint: " + formatNumber(banner.myTL.time()) + "s");
        isCheckpointSet = true;
    }
    else {
        localStorage.removeItem('_BT_checkpoint');
        $("#_BT_checkPoint").html("");
        isCheckpointSet = false;
    }
}

function boost(arg) {
    if(!isSafe()){
        return;
    }

    banner.myTL.timeScale(arg);
}

function animationInterval() {
    if(!isSafe()){
        return;
    }

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
    if(!isSafe()){
        return;
    }

    clearInterval(interval);
}

function formatNumber(arg) {
    if(!isSafe()){
        return;
    }

    return arg.toString().substring(0, 4);
}

function adSize() {
    if(!isSafe()){
        return;
    }

    var _BT_adSize = "(" + banner.adWidth + " x " + banner.adHeight + ")";
    $("#_BT_adNowPlaying").text(document.title.split('-')[0] + _BT_adSize);
    localStorage["_BT_adWidth"] = banner.adWidth;
    localStorage["_BT_adHeight"] = banner.adHeight;
}