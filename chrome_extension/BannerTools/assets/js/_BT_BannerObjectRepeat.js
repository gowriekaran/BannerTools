if(typeof banner != "undefined"){
    document.getElementById("_BT_adRepeatLabel").innerHTML = (banner.myTL.repeat());
}
else{
    console.log("BannerTools could not find Banner object, Object Repeat task aborted");
}