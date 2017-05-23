var playCount = 1;
var autoPlay, interval;
var intervalIsRunning = true;

function animationInterval(){
    $("#slider").slider("value", banner.myTL.progress() * 100);
    $("#_BT_currentTime").html(banner.myTL.time().toString().substring(0,5) + "s");
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
            $("#_BT_currentTime").html(banner.myTL.time().toString().substring(0,5) + "s");
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