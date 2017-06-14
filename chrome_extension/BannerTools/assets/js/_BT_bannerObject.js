var interval;
var isCheckpointSet = false;
var BT;

function bannerTimelineObject(obj){
    if (typeof obj == "undefined") {
        console.log("BannerTools could not find Banner object, Object Script task aborted. Try refreshing.");
    }
    else{
        BT = obj;
    }
}

function isSafe(){
    if (typeof BT == "undefined") {
        console.log("BannerTools could not find Banner object, Object Script task aborted. Try refreshing.");
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
        BT.progress(localStorage['_BT_checkpoint']);
        $("#_BT_checkPoint").html("Checkpoint: " + formatNumber(BT.time()) + "s");
    }

    $("#_BT_adTotalDurationLabel").html("Total time: " + formatNumber(BT.totalDuration()) + "s");
    if (BT.totalDuration() > 30) {
        $("#_BT_adTotalDurationLabel").addClass("._BT_warning");
    }

    $("#_BT_adDurationLabel").html(BT.duration().toString().substring(0, 4) + "s");
    if (BT.duration() > 30) {
        $("#_BT_adDurationLabel").addClass("._BT_warning");
    }

    if ((BT.repeat() + 1) == 1) {
        $("#_BT_adPlaying").html(" once");
    }
    else if ((BT.repeat() + 1) == 2) {
        $("#_BT_adPlaying").html(" twice");
    }
    else {
        $("#_BT_adPlaying").html(BT.repeat() + 1 + " times");
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
            BT.progress(ui.value / 100);
            $("#_BT_currentTime").html(formatNumber(BT.time()) + "s");

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

    BT.progress(0);
    interval = setInterval(animationInterval, 1);
    sliderInterval();
}

function lastFrame(){
    if(!isSafe()){
        return;
    }

    BT.progress(100);
    sliderInterval();
}

function sliderInterval(){
    if(!isSafe()){
        return;
    }

    $("#slider").slider("value", BT.progress() * 100);
    $("#_BT_currentTime").html(BT.time().toString().substring(0,5) + "s");
    stopInterval();
}

function playAnimation() {
    if(!isSafe()){
        return;
    }

    BT.play();
}

function pauseAnimation() {
    if(!isSafe()){
        return;
    }

    BT.pause();
}

function checkpoint() {
    if(!isSafe()){
        return;
    }

    if(!isCheckpointSet){
        if (localStorage['_BT_checkpoint']) {
            BT.progress(localStorage['_BT_checkpoint']);
        }
        else {
            localStorage['_BT_checkpoint'] = BT.progress();
        }
        $("#_BT_checkPoint").html("Checkpoint: " + formatNumber(BT.time()) + "s");
        isCheckpointSet = true;
    }
    else {
        localStorage.removeItem('_BT_checkpoint');
        $("#_BT_checkPoint").html("");
        isCheckpointSet = false;
    }
}

function animationInterval() {
    if(!isSafe()){
        return;
    }

    $("#slider").slider("value", BT.progress() * 100);
    $("#_BT_currentTime").html(formatNumber(BT.time()) + "s");
    if (BT.progress() == 1) {
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
    $("._BT_featureOverlay").css({ width: banner.adWidth, height: banner.adHeight });
    localStorage["_BT_adWidth"] = banner.adWidth;
    localStorage["_BT_adHeight"] = banner.adHeight;
}