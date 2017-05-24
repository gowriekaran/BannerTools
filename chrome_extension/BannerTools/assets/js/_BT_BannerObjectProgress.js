var playCount = 1;
var autoPlay, interval;
var intervalIsRunning = true;

if(localStorage['uniqueID_checkpoint']){
    banner.myTL.progress(localStorage['uniqueID_checkpoint']);
    $("#_BT_checkPoint").html("Checkpoint: " + banner.myTL.time() + "s");
}

function animationInterval(){
    $("#slider").slider("value", banner.myTL.progress() * 100);
    $("#_BT_currentTime").html(banner.myTL.time().toString().substring(0,4) + "s");
    if(banner.myTL.progress() == 1){
        playCount++;

        if(playCount > autoPlay){
            intervalIsRunning = false;
            stopInterval(interval);
        }
    }
}

function stopInterval(interval){
    clearInterval(interval);
}

if (typeof banner != "undefined") {
    autoPlay = banner.myTL.repeat()+1;
    interval = setInterval(animationInterval, 1);

    $( function() {
        $("#slider").slider();
    } );

    $("#slider").slider({
        range: 'min',
        min: 0,
        max: 100,
        step:.1,
        slide: function ( event, ui ) {
            banner.myTL.progress( ui.value/100 );
            $("#_BT_currentTime").html(banner.myTL.time().toString().substring(0,4) + "s");
            if(!intervalIsRunning) {
                intervalIsRunning = true;
                playCount = 1;
                autoPlay = banner.myTL.repeat()+1;
                interval = setInterval(animationInterval, 1);
            }
        }
    });
} else {
    console.log("BannerTools could not find Banner object, Object Progress task aborted");
}

$("#_BT_currentTime").dblclick(function(){
    localStorage['uniqueID_checkpoint'] = banner.myTL.progress();
    $("#_BT_checkPoint").html("Checkpoint: " + banner.myTL.time() + "s");
});

$("#_BT_checkPoint").dblclick(function(){
    localStorage.removeItem('uniqueID_checkpoint');
    $("#_BT_checkPoint").html("");
});