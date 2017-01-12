// console.log("content script loaded");

$(document).ready(function() {
  chrome.storage.sync.get('uniqueID_disable', function(data) {
    // console.log("uniqueID_disable > ",data["uniqueID_disable"]);
    if (data["uniqueID_disable"] == "false"){
      if((!$("#adContainer").length)&&(!$("#ad-container").length)){
        console.log("You must use 'adContainer' or 'ad-container' as ID for BannerTools to function properly!")
      }
      if((!$(".replay_btn").length)&&(!$(".replay-button").length)){
        console.log("You must use 'replay_btn' or 'replay-button' as Class Name for BannerTools to function properly!")
      }

      chrome.storage.sync.get('uniqueID_overflow', function(data) {
      // console.log("uniqueID_overflow > ",data["uniqueID_overflow"]);
        if (data["uniqueID_overflow"] == "visible"){
          overflow("visible");
          $("#showCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_backgroundColor', function(data) {
      // console.log("uniqueID_backgroundColor > ",data["uniqueID_backgroundColor"]);
        if (data["uniqueID_backgroundColor"] == "black"){
          backgroundColor("black");
          $("#blackCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_margin', function(data) {
      // console.log("uniqueID_margin > ",data["uniqueID_margin"]);
        if (data["uniqueID_margin"] == "100px"){
          margin("100px");
          $("#marginCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_replay', function(data) {
      // console.log("uniqueID_replay > ",data["uniqueID_replay"]);
        if (data["uniqueID_replay"] == "hidden"){
          replay("hidden");
          $("#replayCheckbox").prop('checked', true);
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

    var adSize = $("meta[name='ad.size']").attr("content");

    var start_pos = adSize.indexOf('=') + 1;
    var end_pos = adSize.indexOf(',',start_pos);

    var adWidth = adSize.substring(start_pos,end_pos);    
    var adHeight = adSize.split(",").pop();
    adHeight = adSize.split("=").pop();

    var passing_value = "true;"+adWidth+"-"+adHeight;

    setTimeout(function(){chrome.runtime.sendMessage({execute_screenshot: passing_value})}, 1000);
  }
  else{
    $("#adContainer").css("margin","auto");
    $("#ad-container").css("margin","auto");
  }
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

    else if (request.replay == "true"){
      replay("hidden");
    }

    else if (request.replay == "false"){
      replay("");
    }

    else if (request.screenshot == "true"){
      screenshot(0);
    }

    else if (request.screenshot == "false"){
      screenshot(1);
    }
  }
);