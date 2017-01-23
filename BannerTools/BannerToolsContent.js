/**
* Author: Gowriekaran Sinnadurai
* I want to apologize for the nomenclature used. I had to make sure they were as unique as possible to avoid potential conflications.
*/


$(document).ready(function() {
/**
* Global Variables that several functions depend on.
*/

  var _BT_AdContainer,
      _BT_ReplayButton,
      _BT_adWidth,
      _BT_adHeight,
      _BT_stopwatch;

  var _BT_easterEgg = 0;

  var _BT_isInitialized = false;
  var _BT_isExpanded = false;
  var _BT_isStopwatchEnabled = false;

  _BT_initialize();

  function _BT_initialize(){
    /**
    * This is the main setup. It injects BannerTools into the current webpage if all the criteria is met.
    * 1.) Checks if adContainer/ad-container exists. This is helps determine if the current page is in fact banner testing page. You wouldn't this to run on every page.
    * 2.) Checks if the user disabled BannerTools
    */
    if($("#adContainer").length || $("#ad-container").length){
      chrome.storage.sync.get("uniqueID_disable", function(data) {
        if (data["uniqueID_disable"] == "true"){
          console.log("BannerTools is Disabled");
        }
        else {
          _BT_isInitialized = true;

          var _BT_adSize = $("meta[name='ad.size']").attr("content");

          var _BT_start_pos = _BT_adSize.indexOf("=") + 1;
          var _BT_end_pos = _BT_adSize.indexOf(",",_BT_start_pos);

          _BT_adWidth = _BT_adSize.substring(_BT_start_pos,_BT_end_pos);    
          _BT_adHeight = _BT_adSize.split(",").pop();
          _BT_adHeight = _BT_adSize.split("=").pop();

          var BannerTools ='<div id="_BT_SidePanelNav"><img src="http://www.mh.ca/wp-content/uploads/logo-mh.png"><div id="_BT_SidePanel"><table><tr><td class="_BT_Switch_Label">BannerTools</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Disable_Switch"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr></table><div id="_BT_PanelOptions"><p id="BannerInfo">Banner Info</p><table id="BannerInfoPanel"><tr><td>Width:</td><td id="_BT_adWidthLabel">Not Found</td></tr><tr><td>Height:</td><td id="_BT_adHeightLabel">Not Found</td></tr><tr><td>Name:</td><td id="_BT_adNameLabel">Not Found</td></tr></table><p id="DebugOptions">Debug Options</p><table id="DebugOptionsPanel"><tr class="_BT_easter_egg" hidden><td id="_BT_Reset" class="_BT_Switch_Label">Reset</td><td class="_BT_Switch_Control"></td></tr><tr class="_BT_easter_egg" hidden><td class="_BT_Switch_Label">Add Border</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Border_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr><tr><td class="_BT_Switch_Label">Add Margin</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Margin_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr><tr class="_BT_easter_egg" hidden><td class="_BT_Switch_Label">Hide Replay Button</td><td class="_BT_Switch_Control"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Replay_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr><tr><td class="_BT_Switch_Label">Make It Black</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Black_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr><tr><td class="_BT_Switch_Label">Run Timer</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Timer_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr><tr><td class="_BT_Switch_Label">Show Me Everything</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Show_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr></table> <button id="Screenshot_BT_Button" class="hvr-grow">Screenshot</button><div id="_BT_Timer"><span class="_BT_Timer_Stopwatch">1</span> s</div></div></div></div>';
          $("body").append(BannerTools);

          $("#_BT_adWidthLabel").text(_BT_adWidth+"px");
          $("#_BT_adHeightLabel").text(_BT_adHeight+"px");
          $("#_BT_adNameLabel").text(document.title);

    /**************************************CHECK FOR ADCONTAINER/REPLAYBUTTON***********************************************/
          if($("#adContainer").length){
            _BT_AdContainer = "#adContainer";
          }

          else if($("#ad-container").length){
            _BT_AdContainer = "#ad-container";
          }

          if($(".replay_btn").length){
            _BT_ReplayButton = ".replay_btn";
          }

          else if($(".replay-button").length){
            _BT_ReplayButton = ".replay-button";
          }

          else{
            console.log("BannerTools Error:","REPLAY BUTTON NOT FOUND!\nYou must use 'replay_btn' or 'replay-button' as Class Name!");
          }
    /***************************************************EASTER EGG*****************************************************************/

          chrome.storage.sync.get("uniqueID_easterEgg", function(data) {
            if (data["uniqueID_easterEgg"] == "true"){
              $("._BT_easter_egg").toggle();
            }
            else{
              $("#_BT_SidePanelNav img").click(function(event) {
                if (_BT_easterEgg < 4){
                  _BT_easterEgg++;
                }
                if (_BT_easterEgg == 3){
                  chrome.storage.sync.get("uniqueID_border", function(data) {
                    if (data["uniqueID_border"] == "1px solid red"){
                      _BT_border("1px solid red");
                      $("#_BT_Border_Switch").prop("checked", true);
                    }
                  });

                  chrome.storage.sync.get("uniqueID_replay", function(data) {
                    if (data["uniqueID_replay"] == "hidden"){
                      _BT_replay("hidden");
                      $("#_BT_Replay_Switch").prop("checked", true);
                    }
                  });

                  $("._BT_easter_egg").toggle();
                  console.log("Easter Egg Enabled");
                  chrome.storage.sync.set({"uniqueID_easterEgg": "true"});
                }
              });
            }
          });
/**********************************************GETTERS and LISTENERS***********************************************/
          chrome.storage.sync.get("uniqueID_margin", function(data) {
            if (data["uniqueID_margin"] == "100px"){
              _BT_margin("100px");
              $("#_BT_Margin_Switch").prop("checked", true);
            }
          });

          chrome.storage.sync.get("uniqueID_backgroundColor", function(data) {
            if (data["uniqueID_backgroundColor"] == "black"){
              _BT_backgroundColor("black");
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
            console.log("RESETING");
            chrome.storage.sync.clear();
            location.reload();
          });

          $("#_BT_Border_Switch").change(function() {
            if (this.checked) {
              _BT_border("1px solid red");
            }
            else{
              _BT_border("");
            }
          });

          $("#_BT_Replay_Switch").change(function() {
            if (this.checked) {
              _BT_replay("hidden");
            }
            else{
              _BT_replay("");
            }
          });

          $("#_BT_Margin_Switch").change(function() {
            if (this.checked) {
              _BT_margin("100px");
            }
            else{
              _BT_margin("");
            }
          });

          $("#_BT_Black_Switch").change(function() {
            if (this.checked) {
              _BT_backgroundColor("black");
            }
            else{
              _BT_backgroundColor("");
            }
          });

          $("#_BT_Show_Switch").change(function() {
            if (this.checked) {
              _BT_overflow("visible");
            }
            else{
              _BT_overflow("");
            }
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

          $(_BT_ReplayButton).click(function() {
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
      console.log("BannerTools Error:","ADCONTAINER NOT FOUND!\nYou must use 'adContainer' or 'ad-container' as ID!");
    }
  }
/*********************************************KEY FUNCTIONS**********************************************************/
  function _BT_disable(disable_value){
    if(disable_value == "true"){
      _BT_border("");
      _BT_margin("");
      _BT_replay("");
      _BT_backgroundColor("");
      _BT_overflow("");
      _BT_stopwatchTimer(1);

      $("#_BT_Border_Switch").prop("checked", false);
      $("#_BT_Margin_Switch").prop("checked", false);
      $("#_BT_Replay_Switch").prop("checked", false);
      $("#_BT_Black_Switch").prop("checked", false);
      $("#_BT_Show_Switch").prop("checked", false);
      $("#_BT_Timer_Switch").prop("checked", false);

      _BT_closeNav();
      chrome.storage.sync.set({"uniqueID_disable": "true"});
    }
  }

  function _BT_border(border_value){
    // console.log("_BT_border() > ", border_value);
    $(_BT_AdContainer).children().attr("style", "border:" + border_value);
    chrome.storage.sync.set({"uniqueID_border": border_value});
  }

  function _BT_margin(margin_value){
    // console.log("_BT_replay() > ", margin_value);
    $("body").css("margin",margin_value);
    chrome.storage.sync.set({"uniqueID_margin": margin_value});
  }

  function _BT_replay(replay_value){
    // console.log("_BT_disable() > ", replay_value);
    $(_BT_ReplayButton).css("visibility",replay_value);
    chrome.storage.sync.set({"uniqueID_replay": replay_value});
  }

  function _BT_backgroundColor(backgroundColor_value){
    // console.log("_BT_backgroundColor() > ", backgroundColor_value);
    $("body").css("backgroundColor",backgroundColor_value);
    chrome.storage.sync.set({"uniqueID_backgroundColor": backgroundColor_value});
  }

  function _BT_overflow(overflow_value){
    // console.log("_BT_overflow() > ", overflow_value);
    $(_BT_AdContainer).css("overflow",overflow_value);
    chrome.storage.sync.set({"uniqueID_overflow": overflow_value});
  }

  function _BT_screenshot(screenshot_value){
    if(screenshot_value == 0){
      _BT_border("");
      _BT_margin("");
      _BT_replay("");
      _BT_backgroundColor("");
      _BT_overflow("");
      _BT_stopwatchTimer(1);

      $("#_BT_Border_Switch").prop("checked", false);
      $("#_BT_Margin_Switch").prop("checked", false);
      $("#_BT_Replay_Switch").prop("checked", false);
      $("#_BT_Black_Switch").prop("checked", false);
      $("#_BT_Show_Switch").prop("checked", false);
      $("#_BT_Timer_Switch").prop("checked", false);

      _BT_closeNav();

      $(_BT_AdContainer).css("margin",screenshot_value);
      _BT_replay("hidden");

      var passing_value = "true;"+_BT_adWidth+"@"+_BT_adHeight;

      setTimeout(function(){chrome.runtime.sendMessage({execute_screenshot: passing_value})}, 1000);
    }
    else{
      $(_BT_AdContainer).css("margin","auto");
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

/***************************************Navigation Expand/Collapse*************************************************/
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.ExpandPanel == "true"){
        if(_BT_isInitialized == false){
          _BT_initialize();
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
    document.getElementById("_BT_SidePanelNav").style.width = "250px";
    $("#_BT_Disable_Switch").prop("checked", true);
  }

  function _BT_closeNav() {
    _BT_isExpanded = false;
    document.getElementById("_BT_SidePanelNav").style.width = "0";
  }
});