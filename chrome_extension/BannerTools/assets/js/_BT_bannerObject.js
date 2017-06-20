var interval;
var isCheckpointSet = false;

function isSafe() {
    if (typeof banner.myTL == "undefined") {
        console.log("BannerTools could not find Banner object, Object Script task aborted. Try refreshing. Going to retry in 2 seconds.");
        return false;
    }
    else {
        return true;
    }
}

function detect() {
    if ($("script[src*='" + "https://s0.2mdn.net/ads/studio/Enabler.js" + "']").length !== 0) {
        console.log("Enabler!");
        if (Enabler.isInitialized()) {
            enablerStartup();
        } else {
            Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerStartup);
        }
    } else {
        startup();
    }
}

function enablerStartup() {
    setTimeout(function () {
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
        firstFrame();
    }, 1000);
}

function startup() {
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
    var _BT_adSize, _BT_adWidth, _BT_adHeight;

    if (typeof banner == "undefined") {
        _BT_adSize = $("meta[name='ad.size']").attr("content");

        var _BT_start_pos = _BT_adSize.indexOf("=") + 1;
        var _BT_end_pos = _BT_adSize.indexOf(",", _BT_start_pos);

        _BT_adWidth = _BT_adSize.substring(_BT_start_pos, _BT_end_pos);
        _BT_adHeight = _BT_adSize.split(",").pop();
        _BT_adHeight = _BT_adSize.split("=").pop();
    } else {
        _BT_adWidth = banner.adWidth;
        _BT_adHeight = banner.adHeight;
    }
    _BT_adSize = "";
    _BT_adSize = "(" + _BT_adWidth + " x " + _BT_adHeight + ")";
    $("#_BT_adNowPlaying").text(document.title.split('-')[0] + _BT_adSize);
    $("._BT_featureOverlay").css({ width: _BT_adWidth, height: _BT_adHeight });
    localStorage["_BT_adWidth"] = _BT_adWidth;
    localStorage["_BT_adHeight"] = _BT_adHeight;
}