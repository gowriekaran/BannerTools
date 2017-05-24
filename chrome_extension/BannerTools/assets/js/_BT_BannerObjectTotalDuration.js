if(typeof banner != "undefined"){
    $("#_BT_adTotalDurationLabel").html("Total time: " + banner.myTL.totalDuration().toString().substring(0,4) + "s");
    if (banner.myTL.totalDuration() > 30) {
        $("#_BT_adTotalDurationLabel").css("color", "rgb(255,59,48)");
    }
}
else{
    console.log("BannerTools could not find Banner object, Object Total Duration task aborted");
}