$(document).ready(function() {
  var adWidth;
  var adHeight;

  scriptRunner("bannerInfo","true");

  chrome.storage.sync.get('uniqueID_disable', function(data) {

    if (data["uniqueID_disable"] == "true"){
      disable("true");
      $("#disableCheckbox").prop('checked', true);
    }
    else{
      chrome.storage.sync.set({'uniqueID_disable': 'false'});

      chrome.storage.sync.get('uniqueID_overflow', function(data) {
        if (data["uniqueID_overflow"] == "visible"){
          // scriptRunner("overflow","true");
          $("#showCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_backgroundColor', function(data) {
        if (data["uniqueID_backgroundColor"] == "black"){
          // scriptRunner("backgroundColor","true");
          $("#blackCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_margin', function(data) {
        if (data["uniqueID_margin"] == "100px"){
          // scriptRunner("margin","true");
          $("#marginCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_margin', function(data) {
        if (data["uniqueID_margin"] == "100px"){
          // scriptRunner("margin","true");
          $("#marginCheckbox").prop('checked', true);
        }
      });

      chrome.storage.sync.get('uniqueID_timer', function(data) {
        if (data["uniqueID_timer"] == 0){
          // scriptRunner("stopwatchTimer",0);
          $("#timerCheckbox").prop('checked', true);
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

  $('#disableCheckbox').change(function() {
    if (this.checked) {
      disable("true");
    }
    else{
      disable("false");
    }
  });

  $('#screenshotButton').click(function(){
    scriptRunner("overflow","false");
    scriptRunner("backgroundColor","false");
    scriptRunner("margin","false");
    scriptRunner("stopwatchTimer",1);

    $("#showCheckbox").prop('checked', false);
    $("#blackCheckbox").prop('checked', false);
    $("#marginCheckbox").prop('checked', false);

    scriptRunner("screenshot","true");
  });

  $('#timerCheckbox').change(function() {
    if (this.checked) {
      scriptRunner("stopwatchTimer",0);
    }
    else{
      scriptRunner("stopwatchTimer",1);
    }
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
      case "screenshot":
                      chrome.tabs.sendMessage(tabs[0].id, {screenshot: passing_value});
                      break;
      case "stopwatchTimer":
                      chrome.tabs.sendMessage(tabs[0].id, {stopwatchTimer: passing_value});
                      break;
      case "bannerInfo":
                      chrome.tabs.sendMessage(tabs[0].id, {bannerInfo: passing_value});
                      break;
    }
  });
}

function disable(disable_value){
  if(disable_value == "true"){
    scriptRunner("overflow","false");
    scriptRunner("backgroundColor","false");
    scriptRunner("margin","false");
    scriptRunner("stopwatchTimer",1);

    $("#showCheckbox").prop('checked', false);
    $("#blackCheckbox").prop('checked', false);
    $("#marginCheckbox").prop('checked', false);
    $("#timerCheckbox").prop('checked', false);

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
    if (request.execute_screenshot == "true"){
      chrome.tabs.captureVisibleTab(function(data) {       
        var content = document.createElement("canvas");
        var image = new Image();
        image.onload = function() {
          var canvas = content;
          canvas.width = adWidth;
          canvas.height = adHeight;
          var context = canvas.getContext("2d");
          context.drawImage(image, 0, 0);

          var link = document.createElement('a');
          link.download = "backup";
          link.href = content.toDataURL("image/jpeg");
          link.click();
        };

        image.src = data;
        scriptRunner("screenshot","false");
      });
    }

    else if ((request.bannerInfo.indexOf("true") >= 0)){
      var adSize = request.bannerInfo;
      adSize = adSize.split(";").pop();

      adWidth = adSize.split('@')[0];
      adSize = adSize.split('@').pop();

      adHeight = adSize.split('~')[0];
      adSize = adSize.split('~').pop();

      var adName = adSize;


      $("#adWidth").text(adWidth+"px");
      $("#adHeight").text(adHeight+"px");
      $("#adName").text(adName);
    }
  }
);