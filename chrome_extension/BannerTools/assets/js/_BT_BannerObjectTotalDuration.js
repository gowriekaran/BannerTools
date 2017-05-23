if(typeof banner != "undefined"){
    $("#_BT_adTotalDurationLabel").html(banner.myTL.totalDuration() + "s");
    if (banner.myTL.totalDuration() > 30) {
        $("#_BT_adTotalDurationLabel").css("color", "rgb(255,59,48)");
    }
}
else{
    console.log("BannerTools could not find Banner object, Object Total Duration task aborted");
}