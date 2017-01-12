// console.log("background script loaded");

$(document).ready(function() {
  chrome.storage.sync.get('uniqueID_disable', function(data) {
    // console.log("uniqueID_disable > ",data["uniqueID_disable"]);

    if (data["uniqueID_disable"] == "true"){
      disable("true");
      $("#disableCheckbox").prop('checked', true);
    }
    else{
      chrome.storage.sync.set({'uniqueID_disable': 'false'});

      chrome.storage.sync.get('uniqueID_overflow', function(data) {
      // console.log("uniqueID_overflow > ",data["uniqueID_overflow"]);
        if (data["uniqueID_overflow"] == "visible"){
          scriptRunner("overflow","true");
          $("#showCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_backgroundColor', function(data) {
      // console.log("uniqueID_backgroundColor > ",data["uniqueID_backgroundColor"]);
        if (data["uniqueID_backgroundColor"] == "black"){
          scriptRunner("backgroundColor","true");
          $("#blackCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_margin', function(data) {
      // console.log("uniqueID_margin > ",data["uniqueID_margin"]);
        if (data["uniqueID_margin"] == "100px"){
          scriptRunner("margin","true");
          $("#marginCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_replay', function(data) {
      // console.log("uniqueID_replay > ",data["uniqueID_replay"]);
        if (data["uniqueID_replay"] == "hidden"){
          scriptRunner("replay","true");
          $("#replayCheckbox").prop('checked', true);
        }
      });
    }
  });
//------------------------------------------------------------------------------//
  $('#showCheckbox').change(function() {
    if (this.checked) {
      scriptRunner("overflow","true");
    }
    else{
      scriptRunner("overflow","false");
    }
  });

  $('#blackCheckbox').change(function() {
    if (this.checked) {
      scriptRunner("backgroundColor","true");
    }
    else{
      scriptRunner("backgroundColor","false");
    }
  });

  $('#marginCheckbox').change(function() {
    if (this.checked) {
      scriptRunner("margin","true");
    }
    else{
      scriptRunner("margin","false");
    }
  });

  $('#replayCheckbox').change(function() {
    if (this.checked) {
      scriptRunner("replay","true");
    }
    else{
      scriptRunner("replay","false");
    }
  });

  $('#disableCheckbox').change(function() {
    if (this.checked) {
      disable("true");
    }
    else{
      disable("false");
    }
  });

  $('#screenshotButton').click(function(){
    scriptRunner("screenshot","true");
  });
});
//------------------------------------------------------------------------------//
function scriptRunner(calling_method,passing_value){
  // console.log(calling_method, passing_value);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    switch (calling_method){
      case "overflow":
                      chrome.tabs.sendMessage(tabs[0].id, {overflow: passing_value});
                      break;
      case "backgroundColor":
                      chrome.tabs.sendMessage(tabs[0].id, {backgroundColor: passing_value});
                      break;
      case "margin":
                      chrome.tabs.sendMessage(tabs[0].id, {margin: passing_value});
                      break;
      case "replay":
                      chrome.tabs.sendMessage(tabs[0].id, {replay: passing_value});
                      break;
      case "screenshot":
                      chrome.tabs.sendMessage(tabs[0].id, {screenshot: passing_value});
                      break;
    }
  });
}

function disable(disable_value){
  // console.log("disable() > ", disable_value);
  if(disable_value == "true"){
    scriptRunner("overflow","false");
    scriptRunner("backgroundColor","false");
    scriptRunner("margin","false");
    scriptRunner("replay","false");

    $("#showCheckbox").prop('checked', false);
    $("#blackCheckbox").prop('checked', false);
    $("#marginCheckbox").prop('checked', false);
    $("#replayCheckbox").prop('checked', false);

    $("#PanelOptions").toggle();
    chrome.storage.sync.set({'uniqueID_disable': 'true'});
  }
  else{
    $("#PanelOptions").toggle();
    chrome.storage.sync.set({'uniqueID_disable': 'false'});
  }
}



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if ((request.execute_screenshot.indexOf("true") >= 0)){
      chrome.tabs.captureVisibleTab(null, {
        format : "jpeg",
        quality : 100
      }, function(data) {
        var adSize = request.execute_screenshot;
        adSize = adSize.split(";").pop();

        var adWidth = adSize.split('-')[0];
        var adHeight = adSize.split("-").pop();
        
        var content = document.createElement("canvas");
        var image = new Image();
        image.onload = function() {
          var canvas = content;
          canvas.width = adWidth;
          canvas.height = adHeight;
          var context = canvas.getContext("2d");
          context.drawImage(image, 0, 0);

          var link = document.createElement('a');
          link.download = "backup.jpg";
          link.href = content.toDataURL();
          link.click();
        };

        image.src = data;
        scriptRunner("screenshot","false");
      });
    }
  }
);