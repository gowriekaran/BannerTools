if(typeof banner != "undefined"){
    document.getElementById("_BT_adDurationLabel").innerHTML = (banner.myTL.duration() + "s");
    if (banner.myTL.duration() > 30) {
        document.getElementById("_BT_adDurationLabel").style.color = "rgb(255,59,48)";
    }
}
else{
    console.log("BannerTools could not find Banner object, Object Duration task aborted");
}