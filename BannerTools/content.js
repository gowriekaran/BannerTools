$(document).ready(function() {
  var stopwatch = 1;
  var stopwatch_enabled;

  $('body').append('<style type="text/css">#bottomPanel{position:fixed;bottom:0;width:100%;background:rgba(0,0,0,.8);color:#fff;font-weight:700;font-family:arial;font-size:18px}#stopwatchTimer{padding:15px}</style>');
  $('body').append('<div id="bottomPanel" hidden><div id="stopwatchTimer"><span class="stopwatchTimer_display">0</span> s</div></div>');

  chrome.storage.sync.get('uniqueID_disable', function(data) {
    if (data["uniqueID_disable"] == "false"){

      if((!$("#adContainer").length)&&(!$("#ad-container").length)){
        console.log("You must use 'adContainer' or 'ad-container' as ID for BannerTools to function properly!")
      }
      if((!$(".replay_btn").length)&&(!$(".replay-button").length)){
        console.log("You must use 'replay_btn' or 'replay-button' as Class Name for BannerTools to function properly!")
      }

      chrome.storage.sync.get('uniqueID_overflow', function(data) {
        if (data["uniqueID_overflow"] == "visible"){
          overflow("visible");
          $("#showCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_backgroundColor', function(data) {
        if (data["uniqueID_backgroundColor"] == "black"){
          backgroundColor("black");
          $("#blackCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_margin', function(data) {
        if (data["uniqueID_margin"] == "100px"){
          margin("100px");
          $("#marginCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_replay', function(data) {
        if (data["uniqueID_replay"] == "hidden"){
          replay("hidden");
          $("#replayCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_timer', function(data) {
        if (data["uniqueID_timer"] == 0){
          stopwatch = 0;
          stopwatchTimer(0);
          $("#timerCheckbox").prop('checked', true);
        }
      });
    }
  });
});

function overflow(overflow_value){
  // console.log("overflow() > ", overflow_value);
  $("#adContainer").css("overflow",overflow_value);
  $("#ad-container").css("overflow",overflow_value);
  chrome.storage.sync.set({'uniqueID_overflow': overflow_value});
}

function backgroundColor(backgroundColor_value){
  // console.log("backgroundColor() > ", backgroundColor_value);
  $("body").css("backgroundColor",backgroundColor_value);
  chrome.storage.sync.set({'uniqueID_backgroundColor': backgroundColor_value});
}

function margin(margin_value){
  // console.log("replay() > ", margin_value);
  $("body").css("margin",margin_value);
  chrome.storage.sync.set({'uniqueID_margin': margin_value});
}

function replay(replay_value){
  // console.log("disable() > ", replay_value);
  $(".replay_btn").css("visibility",replay_value);
  $(".replay-button").css("visibility",replay_value);
  chrome.storage.sync.set({'uniqueID_replay': replay_value});
}

function screenshot(screenshot_value){
  if(screenshot_value == 0){
    $("#adContainer").css("margin",screenshot_value);
    $("#ad-container").css("margin",screenshot_value);

    replay("hidden");

    setTimeout(function(){chrome.runtime.sendMessage({execute_screenshot: "true"})}, 1250);
  }
  else{
    $("#adContainer").css("margin","auto");
    $("#ad-container").css("margin","auto");

    replay("");
  }
}

$(".replay_btn").click(function() {
  if(stopwatch_enabled){
    stopwatchTimer(1);
    stopwatchTimer(0);
  }
});

function stopwatchTimer(stopwatchTimer_value){
  if(stopwatchTimer_value == 0){
    stopwatch_enabled = true;
    $('#bottomPanel').show();
    stopwatch = setInterval(function() {
        var value = parseInt($('#stopwatchTimer').find('.stopwatchTimer_display').text(), 10);
        
        value++;

        if(value == 15){
          $('#stopwatchTimer').css("color","#4CAF50");
        }

        if(value == 30){
          $('#stopwatchTimer').css("color","#F44336");
        }

        $('#stopwatchTimer').find('.stopwatchTimer_display').text(value);
    },1000);

    setTimeout(function() {clearInterval(stopwatch); },31000);
    chrome.storage.sync.set({'uniqueID_timer': stopwatchTimer_value});
  }
  else{
    $('#bottomPanel').hide();
    clearInterval(stopwatch);
    chrome.storage.sync.set({'uniqueID_timer': stopwatchTimer_value});
  }
}

function bannerInfo(){
  var adSize = $("meta[name='ad.size']").attr("content");

  var start_pos = adSize.indexOf('=') + 1;
  var end_pos = adSize.indexOf(',',start_pos);

  var adWidth = adSize.substring(start_pos,end_pos);    
  var adHeight = adSize.split(",").pop();
  adHeight = adSize.split("=").pop();

  var passing_value = "true;"+adWidth+"@"+adHeight+"~"+document.title;

  chrome.runtime.sendMessage({bannerInfo: passing_value});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.overflow == "true"){
      overflow("visible");
    }

    else if (request.overflow == "false"){
      overflow("");
    }

    else if (request.backgroundColor == "true"){
      backgroundColor("black");
    }

    else if (request.backgroundColor == "false"){
      backgroundColor("");
    }

    else if (request.margin == "true"){
      margin("100px");
    }

    else if (request.margin == "false"){
      margin("");
    }

    else if (request.screenshot == "true"){
      screenshot(0);
    }

    else if (request.screenshot == "false"){
      screenshot(1);
    }

    else if (request.stopwatchTimer == 0){
      chrome.storage.sync.set({'uniqueID_timer': 0});
      location.reload();
    }

    else if (request.stopwatchTimer == 1){
      stopwatchTimer(1);
    }

    else if (request.bannerInfo == "true"){
      bannerInfo();
    }
  }
);