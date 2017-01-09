$(document).ready(function() {
  if((!$("#adContainer").length)&&(!$("#ad-container").length)){
    console.log("You must use 'adContainer' or 'ad-container' as ID for BannerTools to function properly!")
  }
  if((!$(".replay_btn").length)&&(!$(".replay-button").length)){
    console.log("You must use 'replay_btn' or 'replay-button' as Class Name for BannerTools to function properly!")
  }

  chrome.storage.sync.get('uniqueID_overflow', function(data) {
    if (data["uniqueID_overflow"] == "visible"){
      overflow("visible");
    }
  });

  chrome.storage.sync.get('uniqueID_backgroundColor', function(data) {
    if (data["uniqueID_backgroundColor"] == "black"){
      backgroundColor("black");
    }
  });

  chrome.storage.sync.get('uniqueID_margin', function(data) {
    if (data["uniqueID_margin"] == "100px"){
      margin("100px");
    }
  });

  chrome.storage.sync.get('uniqueID_replay', function(data) {
    if (data["uniqueID_replay"] == "hidden"){
      replay("hidden");
    }
  });
});

function overflow(overflow_value){
  $("#adContainer").css("overflow",overflow_value);
  $("#ad-container").css("overflow",overflow_value);
  chrome.storage.sync.set({'uniqueID_overflow': overflow_value});
}

function backgroundColor(backgroundColor_value){
  $("body").css("backgroundColor",backgroundColor_value);
  chrome.storage.sync.set({'uniqueID_backgroundColor': backgroundColor_value});
}

function margin(margin_value){
  $("body").css("margin",margin_value);
  chrome.storage.sync.set({'uniqueID_margin': margin_value});
}

function replay(replay_value){
  $(".replay_btn").css("visibility",replay_value);
  $(".replay-button").css("visibility",replay_value);
  chrome.storage.sync.set({'uniqueID_replay': replay_value});
}