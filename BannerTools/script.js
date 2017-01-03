$(document).ready(function() {

  var backgroundColor_value   = localStorage.getItem('uniqueID_backgroundColor');
  var overflow_value          = localStorage.getItem('uniqueID_overflow');
  var margin_value            = localStorage.getItem('uniqueID_margin');
  var replay_value            = localStorage.getItem('uniqueID_replay');

//------------------------------------------------------------------------------//
  if (backgroundColor_value == "black"){
    backgroundColor("black");
    $("#blackCheckbox").prop('checked', true);
  }
  else{
    backgroundColor("");
  }

  if (overflow_value == "visible"){
    overflow("visible");
    $("#showCheckbox").prop('checked', true);
  }
  else{
    overflow("");
  }

  if (margin_value == "100px"){
    margin("100px");
    $("#marginCheckbox").prop('checked', true);
  }
  else{
    margin("");
  }

  if (replay_value == "hidden"){
    replay("hidden");
    $("#replayCheckbox").prop('checked', true);
  }
  else{
    replay("");
  }

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
  var code  = "document.getElementById('adContainer').style.overflow = '" + overflow_value + "';";
  var code2 = "document.getElementById('ad-container').style.overflow = '" + overflow_value + "';";
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {code:code} );
    chrome.tabs.executeScript(tab.id, {code:code2} );
  });
  localStorage.setItem('uniqueID_overflow',overflow_value);
}

function backgroundColor(backgroundColor_value){
  var code = "document.body.style.backgroundColor = '" + backgroundColor_value + "';";
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {code:code} );
  });
  localStorage.setItem('uniqueID_backgroundColor',backgroundColor_value);
}

function margin(margin_value){
  var code = "document.body.style.margin = '" + margin_value + "';";
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {code:code} );
  });
  localStorage.setItem('uniqueID_margin',margin_value);
}

function replay(replay_value){
  var code = "document.getElementsByClassName('replay_btn')[0].style.visibility  = '" + replay_value + "';";
  var code2 = "document.getElementsByClassName('replay-button')[0].style.visibility  = '" + replay_value + "';";
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {code:code} );
    chrome.tabs.executeScript(tab.id, {code:code2} );
  });
  localStorage.setItem('uniqueID_replay',replay_value);
}