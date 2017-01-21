$(document).ready(function() {
  console.log("BannerToolsContent.js loaded");

  chrome.storage.sync.get('uniqueID_disable', function(data) {
    if (data["uniqueID_disable"] == "false"){
      var currentBody =  $("body").html();
      $("body").empty();
      
      var BannerTools =' <div id="_BT_SidePanelNav"> <a id="Close_BT_Button" class="hvr-push">&times;</a> <img src="http://www.mh.ca/wp-content/uploads/logo-mh.png"> <div id="_BT_SidePanel"> <table> <tr> <td class="_BT_Switch_Label">BannerTools</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="disableSwitch"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr></table> <div id="PanelOptions"> <p id="DebugOptions">Debug Options</p><table id="DebugOptionsPanel"> <tr> <td class="_BT_Switch_Label">Add Border</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Border_BT_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Add Margin</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Margin_BT_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Hide Replay Button</td><td class="_BT_Switch_Control"> <label class="_BT_Switch"> <input type="checkbox" id="Replay_BT_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr> <tr> <td class="_BT_Switch_Label">Make It Black</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Black_BT_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Show Me Everything</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Show_BT_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Show Timer</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="Timer_BT_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr></table> <p id="BannerInfo">Banner Info</p><table id="BannerInfoPanel"> <tr> <td>Width:</td><td id="adWidth">Not Found</td></tr><tr> <td>Height:</td><td id="adHeight">Not Found</td></tr><tr> <td>Name:</td><td id="adName">Not Found</td></tr></table> <button id="ScreenshotBannerToolsButton" class="hvr-grow">Screenshot</button> <div id="Timer"> 00:00:00s </div></div></div></div><div id="BANNER_STAGING">'+currentBody+'</div>';
      $("body").append(BannerTools);

      if((!$("#adContainer").length)&&(!$("#ad-container").length)){
        console.log("BannerTools Error:","ADCONTAINER NOT FOUND!\nYou must use 'adContainer' or 'ad-container' as ID!");
      }

      if((!$(".replay_btn").length)&&(!$(".replay-button").length)){
        console.log("BannerTools Error:","REPLAY BUTTON NOT FOUND!\nYou must use 'replay_btn' or 'replay-button' as Class Name!");
      }

      chrome.storage.sync.get('uniqueID_border', function(data) {
        if (data["uniqueID_border"] == "red"){
          border("red");
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
          stopwatch = 0;
          stopwatchTimer(0);
          $("#Timer_BT_Switch").prop('checked', true);
        }
      });
    
      $('#Border_BT_Switch').change(function() {
        if (this.checked) {
          console.log(this.id,"TOGGLED ON");
          border("red");
        }
        else{
          console.log(this.id,"TOGGLED OFF");
          border("");
        }
      });

      $('#Margin_BT_Switch').change(function() {
        if (this.checked) {
          console.log(this.id,"TOGGLED ON");
          margin("100px");
        }
        else{
          console.log(this.id,"TOGGLED OFF");
          margin("");
        }
      });

      $('#Replay_BT_Switch').change(function() {
        if (this.checked) {
          console.log(this.id,"TOGGLED ON");
          replay("hidden");
        }
        else{
          console.log(this.id,"TOGGFFED ON");
          replay("");
        }
      });

      $('#Black_BT_Switch').change(function() {
        if (this.checked) {
          console.log(this.id,"TOGGLED ON");
          backgroundColor("black");
        }
        else{
          console.log(this.id,"TOGGLED OFF");
          backgroundColor("");
        }
      });

      $('#Show_BT_Switch').change(function() {
        if (this.checked) {
          console.log(this.id,"TOGGLED ON");
          overflow("visible");
        }
        else{
          console.log(this.id,"TOGGLED OFF");
          overflow("");
        }
      });

      $('#Timer_BT_Switch').change(function() {
        if (this.checked) {
          console.log(this.id,"TOGGLED ON");
        }
        else{
          console.log(this.id,"TOGGLED OFF");
        }
      });

      function border(border_value){
        console.log("border() > ", border_value);
        $("#adContainer").children().css("border",border_value);
        chrome.storage.sync.set({'uniqueID_border': border_value});
      }

      function margin(margin_value){
        console.log("replay() > ", margin_value);
        $("body").css("margin",margin_value);
        chrome.storage.sync.set({'uniqueID_margin': margin_value});
      }

      function replay(replay_value){
        console.log("disable() > ", replay_value);
        $(".replay_btn").css("visibility",replay_value);
        $(".replay-button").css("visibility",replay_value);
        chrome.storage.sync.set({'uniqueID_replay': replay_value});
      }

      function backgroundColor(backgroundColor_value){
        console.log("backgroundColor() > ", backgroundColor_value);
        $("body").css("backgroundColor",backgroundColor_value);
        chrome.storage.sync.set({'uniqueID_backgroundColor': backgroundColor_value});
      }

      function overflow(overflow_value){
        console.log("overflow() > ", overflow_value);
        $("#adContainer").css("overflow",overflow_value);
        $("#ad-container").css("overflow",overflow_value);
        chrome.storage.sync.set({'uniqueID_overflow': overflow_value});
      }

      function stopwatchTimer(stopwatchTimer_value){
        //TO DO
      }
    }
    else if (data["uniqueID_disable"] == "true"){
      console.log("BannerTools is Disabled");
    }
  });

/***************************************Navigation Expand/Collapse*************************************************/
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.ExpandPanel == "True"){
        openNav();
      }
    }
  );

  $("#Close_BT_Button").click(function(event) {
    closeNav();
  });

  function openNav() {
      document.getElementById("_BT_SidePanelNav").style.width = "250px";
      document.getElementById("BANNER_STAGING").style.marginRight = "250px";
  }

  function closeNav() {
      document.getElementById("_BT_SidePanelNav").style.width = "0";
      document.getElementById("BANNER_STAGING").style.marginRight= "0";
  }
});