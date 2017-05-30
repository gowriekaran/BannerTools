if ((typeof banner != "undefined")&&(typeof banner.myTL != "undefined")) {
    banner.myTL.progress(0);
    $("#slider").slider("value", banner.myTL.progress() * 100);
    $("#_BT_currentTime").html(banner.myTL.time().toString().substring(0,5) + "s");
    stopInterval(interval);
    intervalIsRunning = true;
    playCount = 1;
    autoPlay = banner.myTL.repeat()+1;
    interval = setInterval(animationInterval, 1);
}
else{
    console.log("BannerTools could not find Banner object, Object First Frame task aborted");
}