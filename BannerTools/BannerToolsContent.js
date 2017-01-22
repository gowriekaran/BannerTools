$(document).ready(function() {
  console.log("BannerToolsContent.js loaded");
  // chrome.storage.sync.clear();
  var _BT_AdContainer,
      _BT_ReplayButton,
      _BT_adWidth,
      _BT_adHeight;

  var _BT_isInitialized = false;
  var _BT_isExpanded = false;
  initialize();

  function initialize(){
    chrome.storage.sync.get('uniqueID_disable', function(data) {
      if (data["uniqueID_disable"] == "true"){
        console.log("BannerTools is Disabled");
      }
      else {
      // if (data["uniqueID_disable"] == "false"){
        _BT_isInitialized = true;

        var _BT_adSize = $("meta[name='ad.size']").attr("content");

        var _BT_start_pos = _BT_adSize.indexOf('=') + 1;
        var _BT_end_pos = _BT_adSize.indexOf(',',_BT_start_pos);

        _BT_adWidth = _BT_adSize.substring(_BT_start_pos,_BT_end_pos);    
        _BT_adHeight = _BT_adSize.split(",").pop();
        _BT_adHeight = _BT_adSize.split("=").pop();

        var currentBody =  $("body").html();
        $("body").empty();
        
        var BannerTools ='<div id="_BT_SidePanelNav"><p id="Close_BT_Button" class="hvr-push">&times;</p> <img src="http://www.mh.ca/wp-content/uploads/logo-mh.png"><div id="_BT_SidePanel"><table><tr><td class="_BT_Switch_Label">BannerTools</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Disable_BT_Switch"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr></table><div id="_BT_PanelOptions"><p id="BannerInfo">Banner Info</p><table id="BannerInfoPanel"><tr><td>Width:</td><td id="_BT_adWidthLabel">Not Found</td></tr><tr><td>Height:</td><td id="_BT_adHeightLabel">Not Found</td></tr><tr><td>Name:</td><td id="_BT_adNameLabel">Not Found</td></tr></table><p id="DebugOptions">Debug Options</p><table id="DebugOptionsPanel"><tr><td class="_BT_Switch_Label">Add Border</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Border_BT_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr><tr><td class="_BT_Switch_Label">Add Margin</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Margin_BT_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr><tr><td class="_BT_Switch_Label">Hide Replay Button</td><td class="_BT_Switch_Control"> <label class="_BT_Switch"> <input type="checkbox" id="Replay_BT_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr><tr><td class="_BT_Switch_Label">Make It Black</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Black_BT_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr><tr><td class="_BT_Switch_Label">Show Me Everything</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Show_BT_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr><tr><td class="_BT_Switch_Label">Show Timer</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Timer_BT_Switch" value="off"><div class="_BT_Slider _BT_SliderRound"></div> </label></td></tr></table> <button id="Screenshot_BT_Button" class="hvr-grow">Screenshot</button><div id="_BT_Timer"><span class="_BT_Timer_Stopwatch">0</span> s</div></div></div></div><div id="BANNER_STAGING">'+currentBody+'</div>';
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

        else{
          console.log("BannerTools Error:","ADCONTAINER NOT FOUND!\nYou must use 'adContainer' or 'ad-container' as ID!");
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
  /********************************************************************************************************************/
        chrome.storage.sync.get('uniqueID_border', function(data) {
          if (data["uniqueID_border"] == "1px solid red"){
            border("1px solid red");
            $("#Border_BT_Switch").prop('checked', true);
          }
        });

        chrome.storage.sync.get('uniqueID_margin', function(data) {
          if (data["uniqueID_margin"] == "100px"){
            margin("100px");
            $("#Margin_BT_Switch").prop('checked', true);
          }
        });

        chrome.storage.sync.get('uniqueID_replay', function(data) {
          if (data["uniqueID_replay"] == "hidden"){
            replay("hidden");
            $("#Replay_BT_Switch").prop('checked', true);
          }
        });

        chrome.storage.sync.get('uniqueID_backgroundColor', function(data) {
          if (data["uniqueID_backgroundColor"] == "black"){
            backgroundColor("black");
            $("#Black_BT_Switch").prop('checked', true);
          }
        });

        chrome.storage.sync.get('uniqueID_overflow', function(data) {
          if (data["uniqueID_overflow"] == "visible"){
            overflow("visible");
            $("#Show_BT_Switch").prop('checked', true);
          }
        });

        chrome.storage.sync.get('uniqueID_timer', function(data) {
          if (data["uniqueID_timer"] == 0){
            //
            $("#Timer_BT_Switch").prop('checked', true);
          }
        });
      
        $("#Close_BT_Button").click(function(event) {
          closeNav();
        });

        $('#Disable_BT_Switch').change(function() {
          if (this.checked) {
            // disable("false");
          }
          else{
            disable("true");
          }
        });

        $('#Border_BT_Switch').change(function() {
          if (this.checked) {
            border("1px solid red");
          }
          else{
            border("");
          }
        });

        $('#Margin_BT_Switch').change(function() {
          if (this.checked) {
            margin("100px");
          }
          else{
            margin("");
          }
        });

        $('#Replay_BT_Switch').change(function() {
          if (this.checked) {
            replay("hidden");
          }
          else{
            replay("");
          }
        });

        $('#Black_BT_Switch').change(function() {
          if (this.checked) {
            backgroundColor("black");
          }
          else{
            backgroundColor("");
          }
        });

        $('#Show_BT_Switch').change(function() {
          if (this.checked) {
            overflow("visible");
          }
          else{
            overflow("");
          }
        });

        $('#Timer_BT_Switch').change(function() {
          if (this.checked) {
            console.log(this.id,"TOGGLED ON");
            stopwatchTimer(0);
            //
          }
          else{
            console.log(this.id,"TOGGLED OFF");
            //
          }
        });

        $('#Screenshot_BT_Button').click(function(){
          screenshot(0);
        });

        // $(".replay_btn").click(function() {
        //   if(stopwatch_enabled){
        //     stopwatchTimer(1);
        //     stopwatchTimer(0);
        //   }
        // });

        openNav();
      }
    });
  }

  function disable(disable_value){
    if(disable_value == "true"){
      border("");
      margin("");
      replay("");
      backgroundColor("");
      overflow("");
      // timer();

      $("#Border_BT_Switch").prop('checked', false);
      $("#Margin_BT_Switch").prop('checked', false);
      $("#Replay_BT_Switch").prop('checked', false);
      $("#Black_BT_Switch").prop('checked', false);
      $("#Show_BT_Switch").prop('checked', false);
      // $("#Timer_BT_Switch").prop('checked', false);
      closeNav();
      chrome.storage.sync.set({'uniqueID_disable': 'true'});
    }
    // else{
    //   _BT_isInitialized = true;
    //   chrome.storage.sync.set({'uniqueID_disable': 'false'});
    // }
  }

  function border(border_value){
    // console.log("border() > ", border_value);
    $(_BT_AdContainer).children().attr("style", "border:" + border_value);
    chrome.storage.sync.set({'uniqueID_border': border_value});
  }

  function margin(margin_value){
    // console.log("replay() > ", margin_value);
    $("#BANNER_STAGING").css("margin",margin_value);
    chrome.storage.sync.set({'uniqueID_margin': margin_value});
  }

  function replay(replay_value){
    // console.log("disable() > ", replay_value);
    $(_BT_ReplayButton).css("visibility",replay_value);
    chrome.storage.sync.set({'uniqueID_replay': replay_value});
  }

  function backgroundColor(backgroundColor_value){
    // console.log("backgroundColor() > ", backgroundColor_value);
    $("body").css("backgroundColor",backgroundColor_value);
    chrome.storage.sync.set({'uniqueID_backgroundColor': backgroundColor_value});
  }

  function overflow(overflow_value){
    // console.log("overflow() > ", overflow_value);
    $(_BT_AdContainer).css("overflow",overflow_value);
    chrome.storage.sync.set({'uniqueID_overflow': overflow_value});
  }

  function screenshot(screenshot_value){
    if(screenshot_value == 0){
      border("");
      margin("");
      replay("");
      backgroundColor("");
      overflow("");
      // timer();

      $("#Border_BT_Switch").prop('checked', false);
      $("#Margin_BT_Switch").prop('checked', false);
      $("#Replay_BT_Switch").prop('checked', false);
      $("#Black_BT_Switch").prop('checked', false);
      $("#Show_BT_Switch").prop('checked', false);
      // $("#Timer_BT_Switch").prop('checked', false);
      closeNav();

      $(_BT_AdContainer).css("margin",screenshot_value);
      replay("hidden");

      var passing_value = "true;"+_BT_adWidth+"@"+_BT_adHeight;

      setTimeout(function(){chrome.runtime.sendMessage({execute_screenshot: passing_value})}, 1000);
    }
    else{
      $(_BT_AdContainer).css("margin","auto");
      openNav();
      replay("");
    }
  }

  function stopwatchTimer(stopwatchTimer_value){
    // if(stopwatchTimer_value == 0){
      // stopwatch_enabled = true;
          $('#_BT_Timer').show();
          var stopwatch = setInterval(function() {
          var value = parseInt($('#_BT_Timer').find('._BT_Timer_Stopwatch').text(), 10);
          
          value++;

          $('#_BT_Timer').find('._BT_Timer_Stopwatch').text(value);
      },1000);

      setTimeout(function() {clearInterval(stopwatch); },30001);
      // chrome.storage.sync.set({'uniqueID_timer': stopwatchTimer_value});
    // }
    // else{
    //   $('#bottomPanel').hide();
    //   clearInterval(stopwatch);
    //   chrome.storage.sync.set({'uniqueID_timer': stopwatchTimer_value});
    // }
  }

/***************************************Navigation Expand/Collapse*************************************************/
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.ExpandPanel == "true"){
        if(_BT_isInitialized == false){
          initialize();
        }
        else{
          if(_BT_isExpanded == false){
            openNav();
          }
          else{
            closeNav();
          }
        }
      }
      else if (request.screenshot == "false"){
        screenshot(1);
      }
    }
  );

  function openNav(){
    _BT_isExpanded = true;
    document.getElementById("_BT_SidePanelNav").style.width = "250px";
    document.getElementById("BANNER_STAGING").style.marginRight = "250px";
    $("#Disable_BT_Switch").prop('checked', true);
  }

  function closeNav() {
    _BT_isExpanded = false;
    document.getElementById("_BT_SidePanelNav").style.width = "0";
    document.getElementById("BANNER_STAGING").style.marginRight= "0";
  }
});