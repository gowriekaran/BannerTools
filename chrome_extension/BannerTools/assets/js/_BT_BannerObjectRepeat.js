if(typeof banner != "undefined"){
    if((banner.myTL.repeat()+1) == 1){
        $("#_BT_adPlaying").html(" once");
    }
    else if((banner.myTL.repeat()+1) == 2){
        $("#_BT_adPlaying").html(" twice");
    }
    else{
        $("#_BT_adPlaying").html(banner.myTL.repeat()+1 + " times");
    }
}
else{
    console.log("BannerTools could not find Banner object, Object Repeat task aborted");
}