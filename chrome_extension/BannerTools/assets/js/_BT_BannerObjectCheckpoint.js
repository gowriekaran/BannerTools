if ((typeof banner != "undefined")&&(typeof banner.myTL != "undefined")) {
    if(arg == 2){
        if (!localStorage['uniqueID_checkpoint']){
            localStorage['uniqueID_checkpoint'] = banner.myTL.progress();
            $("#_BT_checkPoint").html("Checkpoint: " + formatNumber(banner.myTL.time()) + "s");
        }
    }
    else {
        localStorage.removeItem('uniqueID_checkpoint');
        $("#_BT_checkPoint").html("");
    }
}
else {
    console.log("BannerTools could not find Banner object, Object Boost task aborted");
}