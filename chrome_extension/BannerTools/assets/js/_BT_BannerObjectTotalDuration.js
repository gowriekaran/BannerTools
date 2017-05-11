if(typeof banner != "undefined"){
    document.getElementById("_BT_adTotalDurationLabel").innerHTML = (banner.myTL.totalDuration() + "s");
    if (banner.myTL.duration() > 30) {
        document.getElementById("_BT_adTotalDurationLabel").style.color = "rgb(255,59,48)";
    }
}
else{
    console.log("BannerTools could not find Banner object, Object Total Duration task aborted");
}