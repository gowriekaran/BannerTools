/*
  Created by: Gowriekaran Sinnadurai
  I want to apologize for the nomenclature used.
  I had to make sure they were as unique as possible to avoid potential conflictions.
*/

$(document).ready(function() {
  var _BT_version = 1.3;

  var _BT_adWidth,
      _BT_adHeight,
      _BT_stopwatch;

  var _BT_easterEgg = 0;
  var _BT_override = 0;

  var _BT_isInitialized = false;
  var _BT_isExpanded = false;
  var _BT_isStopwatchEnabled = false;

  chrome.storage.sync.get("uniqueID_override", function(data) {
    if (data["uniqueID_override"] == "1"){
      _BT_override = 1;
    }
    _BT_initialize(_BT_override);
  });

  function _BT_initialize(override_value){
/*
  _____       _ _   _       _    _____      _
 |_   _|     (_) | (_)     | |  / ____|    | |
   | |  _ __  _| |_ _  __ _| | | (___   ___| |_ _   _ _ __
   | | | '_ \| | __| |/ _` | |  \___ \ / _ \ __| | | | '_ \
  _| |_| | | | | |_| | (_| | |  ____) |  __/ |_| |_| | |_) |
 |_____|_| |_|_|\__|_|\__,_|_| |_____/ \___|\__|\__,_| .__/
                                                     | |
                                                     |_|
*/
    if($("#ad-container").length || override_value == 1){
      chrome.storage.sync.get("uniqueID_disable", function(data) {
        if (data["uniqueID_disable"] == "true"){
          console.log("BannerTools is currently disabled. Click on the extension to launch it!");
        }
        else {
          _BT_isInitialized = true;

          var _BT_adSize = $("meta[name='ad.size']").attr("content");

          var _BT_start_pos = _BT_adSize.indexOf("=") + 1;
          var _BT_end_pos = _BT_adSize.indexOf(",",_BT_start_pos);

          _BT_adWidth = _BT_adSize.substring(_BT_start_pos,_BT_end_pos);
          _BT_adHeight = _BT_adSize.split(",").pop();
          _BT_adHeight = _BT_adSize.split("=").pop();

          var BannerTools ='<div id="_BT_SidePanelNav"> <img class="hvr-bounce-out" id="_BT_Logo"> <div id="_BT_SidePanelNav_Options"> <table> <tr> <td id="_BT_version" class="_BT_Switch_Label">BannerTools</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Disable_Switch"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr></table> <p id="BannerInfo">Banner Info</p><table id="BannerInfoPanel"> <tr> <td>Name:</td><td id="_BT_adNameLabel">Not Found</td></tr><tr> <td>Specs:</td><td id="_BT_adSpecsLabel">Not Found</td></tr></table> <p id="DebugOptions">Debug Options</p><table id="DebugOptionsPanel"> <tr class="_BT_easter_egg" hidden> <td id="_BT_Reset" class="_BT_Switch_Label">Reset</td><td class="_BT_Switch_Control"></td></tr><tr class="_BT_easter_egg" hidden> <td id="_BT_Override" class="_BT_Switch_Label">Override</td><td class="_BT_Switch_Control"></td></tr><tr> <td class="_BT_Switch_Label">Add Margin</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Margin_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr class="_BT_easter_egg" hidden> <td class="_BT_Switch_Label">Hide Replay Button</td><td class="_BT_Switch_Control"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Replay_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Make It Black</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Black_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Run Timer</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Timer_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Show Me Everything</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Show_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr></table> <button id="Screenshot_BT_Button" class="hvr-grow">Screenshot</button> <div id="_BT_Timer"><span class="_BT_Timer_Stopwatch">1</span> s</div></div></div>';
          $("body").append(BannerTools);

          $("#_BT_Logo").attr("src", chrome.extension.getURL('/assets/img/Logo.png'));

          $("#_BT_adSpecsLabel").text(_BT_adWidth+" x " + _BT_adHeight);
          $("#_BT_adNameLabel").text(document.title);
/*
  ______          _              ______
 |  ____|        | |            |  ____|
 | |__   __ _ ___| |_ ___ _ __  | |__   __ _  __ _
 |  __| / _` / __| __/ _ \ '__| |  __| / _` |/ _` |
 | |___| (_| \__ \ ||  __/ |    | |___| (_| | (_| |
 |______\__,_|___/\__\___|_|    |______\__, |\__, |
                                        __/ | __/ |
                                       |___/ |___/
*/
          chrome.storage.sync.get("uniqueID_easterEgg", function(data) {
            if (data["uniqueID_easterEgg"] == "true"){
              $("._BT_easter_egg").toggle();

              chrome.storage.sync.get("uniqueID_replay", function(data) {
                if (data["uniqueID_replay"] == "hidden"){
                  _BT_replay("hidden");
                  $("#_BT_Replay_Switch").prop("checked", true);
                }
              });
              $("#_BT_version").append(' v' + _BT_version);
            }
            else{
              $("#_BT_SidePanelNav img").click(function(event) {
                if (_BT_easterEgg < 4){
                  _BT_easterEgg++;
                }
                if (_BT_easterEgg == 3){
                  chrome.storage.sync.get("uniqueID_replay", function(data) {
                    if (data["uniqueID_replay"] == "hidden"){
                      _BT_replay("hidden");
                      $("#_BT_Replay_Switch").prop("checked", true);
                    }
                  });

                  $("._BT_easter_egg").toggle();
                  $("#_BT_version").append(' v1.3');
                  chrome.storage.sync.set({"uniqueID_easterEgg": "true"});
                }
              });
            }
          });
/*
   _____      _   _                              _    _____      _   _
  / ____|    | | | |                            | |  / ____|    | | | |
 | |  __  ___| |_| |_ ___ _ __    __ _ _ __   __| | | (___   ___| |_| |_ ___ _ __ ___
 | | |_ |/ _ \ __| __/ _ \ '__|  / _` | '_ \ / _` |  \___ \ / _ \ __| __/ _ \ '__/ __|
 | |__| |  __/ |_| ||  __/ |    | (_| | | | | (_| |  ____) |  __/ |_| ||  __/ |  \__ \
  \_____|\___|\__|\__\___|_|     \__,_|_| |_|\__,_| |_____/ \___|\__|\__\___|_|  |___/
*/
          chrome.storage.sync.get("uniqueID_margin", function(data) {
            if (data["uniqueID_margin"] == "100px"){
              _BT_margin("100px");
              $("#_BT_Margin_Switch").prop("checked", true);
            }
          });

          chrome.storage.sync.get("uniqueID_backgroundColor", function(data) {
            if (data["uniqueID_backgroundColor"] == "rgba(0,0,0,0.8)"){
              _BT_backgroundColor("rgba(0,0,0,0.8)");
              $("#_BT_Black_Switch").prop("checked", true);
            }
          });

          chrome.storage.sync.get("uniqueID_overflow", function(data) {
            if (data["uniqueID_overflow"] == "visible"){
              _BT_overflow("visible");
              $("#_BT_Show_Switch").prop("checked", true);
            }
          });

          chrome.storage.sync.get("uniqueID_timer", function(data) {
            if (data["uniqueID_timer"] == 0){
              _BT_stopwatchTimer(0);
              $("#_BT_Timer_Switch").prop("checked", true);
            }
            else{
              _BT_stopwatchTimer(1);
            }
          });

          $("#_BT_Disable_Switch").change(function() {
            if (!this.checked) {
              _BT_disable("true");
            }
          });

          $("#_BT_Reset").click(function() {
            chrome.storage.sync.clear();
            location.reload();
          });

          $("#_BT_Override").click(function() {
            chrome.storage.sync.set({"uniqueID_override": "1"});
            location.reload();
          });

          $("#_BT_Replay_Switch").change(function() {
            (this.checked) ? ( _BT_replay("hidden")) : (_BT_replay(""));
          });

          $("#_BT_Margin_Switch").change(function() {
            (this.checked) ? ( _BT_margin("100px")) : (_BT_margin(""));
          });

          $("#_BT_Black_Switch").change(function() {
            (this.checked) ? ( _BT_backgroundColor("rgba(0,0,0,0.8)")) : (_BT_backgroundColor(""));
          });

          $("#_BT_Show_Switch").change(function() {
            (this.checked) ? ( _BT_overflow("visible")) : (_BT_overflow(""));
          });

          $("#_BT_Timer_Switch").change(function() {
            if (this.checked) {
              chrome.storage.sync.set({"uniqueID_timer": 0});
              location.reload();
            }
            else{
              _BT_stopwatchTimer(1);
            }
          });

          $("#Screenshot_BT_Button").click(function(){
            _BT_screenshot(0);
          });

          $(".replay-button").click(function() {
            if(_BT_isStopwatchEnabled){
              _BT_stopwatchTimer(1);
              _BT_stopwatchTimer(0);
            }
          });

          _BT_openNav();
        }
      });
    }
    else{
      console.log("BannerTools will remain disabled as it could not find 'ad-container' ID!");
    }
  }
/*
   _____                 ______                _   _
  / ____|               |  ____|              | | (_)
 | |     ___  _ __ ___  | |__ _   _ _ __   ___| |_ _  ___  _ __  ___
 | |    / _ \| '__/ _ \ |  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 | |___| (_) | | |  __/ | |  | |_| | | | | (__| |_| | (_) | | | \__ \
  \_____\___/|_|  \___| |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
*/
  function _BT_Reset(){
      _BT_margin("");
      _BT_replay("");
      _BT_backgroundColor("");
      _BT_overflow("");
      _BT_stopwatchTimer(1);
      $("[id*=_Switch]").prop("checked", false);
  }

  function _BT_disable(disable_value){
    if(disable_value == "true"){
      _BT_Reset();
      _BT_closeNav();
      chrome.storage.sync.set({"uniqueID_disable": "true"});
    }
  }

  function _BT_margin(margin_value){
    $("body").css("margin",margin_value);
    chrome.storage.sync.set({"uniqueID_margin": margin_value});
  }

  function _BT_replay(replay_value){
    $(".replay-button").css("visibility",replay_value);
    chrome.storage.sync.set({"uniqueID_replay": replay_value});
  }

  function _BT_backgroundColor(backgroundColor_value){
    $("body").css("backgroundColor",backgroundColor_value);
    chrome.storage.sync.set({"uniqueID_backgroundColor": backgroundColor_value});
  }

  function _BT_overflow(overflow_value){
    $("#ad-container").css("overflow",overflow_value);
    chrome.storage.sync.set({"uniqueID_overflow": overflow_value});
  }

  function _BT_screenshot(screenshot_value){
    if(screenshot_value == 0){
      _BT_Reset();
      _BT_closeNav();

      $("#ad-container").css("margin",screenshot_value);
      _BT_replay("hidden");

      var passing_value = "true;"+_BT_adWidth+"@"+_BT_adHeight;

      setTimeout(function(){chrome.runtime.sendMessage({execute_screenshot: passing_value})}, 1000);
    }
    else{
      $("#ad-container").css("margin","auto");
      _BT_openNav();
      _BT_replay("");
    }
  }

  function _BT_stopwatchTimer(stopwatchTimer_value){
    if(stopwatchTimer_value == 0){
      $("#_BT_Timer").show();
      _BT_isStopwatchEnabled = true;
      _BT_stopwatch = setInterval(function() {
        var value = parseInt($("#_BT_Timer").find("._BT_Timer_Stopwatch").text(), 10);
        value++;
        $("#_BT_Timer").find("._BT_Timer_Stopwatch").text(value);
      },1000);

      setTimeout(function() {clearInterval(_BT_stopwatch); },30000);
      chrome.storage.sync.set({"uniqueID_timer": stopwatchTimer_value});
    }
    else{
      _BT_isStopwatchEnabled = false;
      $("._BT_Timer_Stopwatch").text("1");
      $("#_BT_Timer").hide();
      clearInterval(_BT_stopwatch);
      chrome.storage.sync.set({"uniqueID_timer": stopwatchTimer_value});
    }
  }
/*
  _   _             _             _   _               ______                            _     _______      _ _
 | \ | |           (_)           | | (_)             |  ____|                          | |   / / ____|    | | |
 |  \| | __ ___   ___  __ _  __ _| |_ _  ___  _ __   | |__  __  ___ __   __ _ _ __   __| |  / / |     ___ | | | __ _ _ __  ___  ___
 | . ` |/ _` \ \ / / |/ _` |/ _` | __| |/ _ \| '_ \  |  __| \ \/ / '_ \ / _` | '_ \ / _` | / /| |    / _ \| | |/ _` | '_ \/ __|/ _ \
 | |\  | (_| |\ V /| | (_| | (_| | |_| | (_) | | | | | |____ >  <| |_) | (_| | | | | (_| |/ / | |___| (_) | | | (_| | |_) \__ \  __/
 |_| \_|\__,_| \_/ |_|\__, |\__,_|\__|_|\___/|_| |_| |______/_/\_\ .__/ \__,_|_| |_|\__,_/_/   \_____\___/|_|_|\__,_| .__/|___/\___|
                       __/ |                                     | |                                                | |
                      |___/                                      |_|                                                |_|
*/
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.ExpandPanel == "true"){

        if(_BT_isInitialized == false){
          chrome.storage.sync.get("uniqueID_override", function(data) {
            if (data["uniqueID_override"] == "1"){
              _BT_override = 1;
            }
            _BT_initialize(_BT_override);
          });
        }
        else{
          if(_BT_isExpanded == false){
            _BT_openNav();
          }
          else{
            _BT_closeNav();
          }
        }
      }
      else if (request.screenshot == "false"){
        _BT_screenshot(1);
      }
    }
  );

  function _BT_openNav(){
    _BT_isExpanded = true;
    document.getElementById("_BT_SidePanelNav").style.width = "200px";
    $("#_BT_Disable_Switch").prop("checked", true);
    console.log("BannerTools has been enabled!");
  }

  function _BT_closeNav() {
    _BT_isExpanded = false;
    document.getElementById("_BT_SidePanelNav").style.width = "0";
    console.log("BannerTools has been disabled. Click on the extension to relaunch it!");
  }
});