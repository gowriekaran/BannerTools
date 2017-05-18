if (typeof banner != "undefined") {
    $( function() {
        $("#slider").slider();
    } );

    $("#slider").slider({
        range: 'min',
        min: 0,
        max: 100,
        step:.1,
        slide: function ( event, ui ) {
            $( "#slider .ui-slider-range" ).css('background', 'rgb(24,73,103)');
            banner.myTL.progress( ui.value/100 );
        }
    });

    // var autoPlay = banner.myTL.repeat()+1;
    // var playCount = 1;

    // console.log(autoPlay);
    // console.log(playCount);
    // console.log("--------");

    var Interval = setInterval(
                    function(){
                        // if(banner.myTL.progress() == 1){
                        //     playCount++;
                        //     console.log(playCount);
                        // }

                        // if(playCount > autoPlay){
                        //     console.log("Stopping Interval");
                        //     stopInterval(Interval);
                        // }

                        // else{
                            $("#slider").slider("value", banner.myTL.progress() * 100);
                        // }
                    }
                , 1);

    function stopInterval(Interval){
        clearInterval(Interval);
    }
} else {
    console.log("BannerTools could not find Banner object, Object Progress task aborted");
}