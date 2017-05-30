if ((typeof banner != "undefined")&&(typeof banner.myTL != "undefined")) {
    banner.myTL.progress(100);
    $("#slider").slider("value", banner.myTL.progress() * 100);
    $("#_BT_currentTime").html(banner.myTL.time().toString().substring(0,5) + "s");
    stopInterval(interval);
    intervalIsRunning = false;
    playCount = banner.myTL.repeat() + 2;
}
else{
    console.log("BannerTools could not find Banner object, Object Last Frame task aborted");
}