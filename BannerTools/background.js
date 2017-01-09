$(document).ready(function() {
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
//------------------------------------------------------------------------------//
  $('#showCheckbox').change(function() {
    if (this.checked) {
      overflow("visible");
    }
    else{
      overflow("");
    }
  });

  $('#blackCheckbox').change(function() {
    if (this.checked) {
      backgroundColor("black");
    }
    else{
      backgroundColor("");
    }
  });

  $('#marginCheckbox').change(function() {
    if (this.checked) {
      margin("100px");
    }
    else{
      margin("");
    }
  });

  $('#replayCheckbox').change(function() {
    if (this.checked) {
      replay("hidden");
    }
    else{
      replay("");
    }
  });
});
//------------------------------------------------------------------------------//
function overflow(overflow_value){
  var code = '$("#adContainer").css("overflow","' + overflow_value + '")';
  var code2 = '$("#ad-container").css("overflow","' + overflow_value + '")';
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {code:code} );
    chrome.tabs.executeScript(tab.id, {code:code2} );
  });
  chrome.storage.sync.set({'uniqueID_overflow': overflow_value});
}

function backgroundColor(backgroundColor_value){
  var code = '$("body").css("backgroundColor","' + backgroundColor_value + '")';
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {code:code} );
  });
  chrome.storage.sync.set({'uniqueID_backgroundColor': backgroundColor_value});
}

function margin(margin_value){
  var code = '$("body").css("margin","' + margin_value + '")';
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {code:code} );
  });
  chrome.storage.sync.set({'uniqueID_margin': margin_value});
}

function replay(replay_value){
  var code = '$(".replay_btn").css("visibility","' + replay_value + '")';
  var code2 = '$(".replay-button").css("visibility","' + replay_value + '")';

  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {code:code} );
    chrome.tabs.executeScript(tab.id, {code:code2} );
  });
  chrome.storage.sync.set({'uniqueID_replay': replay_value});
}