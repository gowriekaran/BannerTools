if(typeof banner != "undefined"){
    $("#_BT_adDurationLabel").html(banner.myTL.duration().toString().substring(0,4) + "s");
    if (banner.myTL.duration() > 30) {
        $("#_BT_adDurationLabel").css("color", "rgb(255,59,48)");
    }
}
else{
    console.log("BannerTools could not find Banner object, Object Duration task aborted");
}