/*
  Created by: Gowriekaran Sinnadurai
  I want to apologize for the nomenclature used.
  I had to make sure they were as unique as possible to avoid potential conflictions.
*/

$(document).ready(function () {
  var _BT_version = 1.6;
  var _BT_adWidth, _BT_adHeight;
  var _BT_easterEgg = _BT_override = _BT_toastEnabled = 0;
  var _BT_isInitialized = _BT_isExpanded = false;

  chrome.storage.sync.get("uniqueID_override", function (data) {
    if (data["uniqueID_override"] == 1) {
      _BT_override = 1;
    }
    _BT_initialize(_BT_override);
  });

  chrome.storage.sync.get("uniqueID_toast", function (data) {
    if (data["uniqueID_toast"] == 1) {
      _BT_toast(1);
    }
  });

  function _BT_initialize(override_value) {
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
    if ($("#ad-container").length || override_value == 1) {
      chrome.storage.sync.get("uniqueID_disable", function (data) {
        if (data["uniqueID_disable"] == "true") {
          _BT_ToastNotification("BannerTools is currently disabled. Click on the extension to launch it!");
        } else {
          _BT_isInitialized = true;

          var _BT_adSize = $("meta[name='ad.size']").attr("content");

          var _BT_start_pos = _BT_adSize.indexOf("=") + 1;
          var _BT_end_pos = _BT_adSize.indexOf(",", _BT_start_pos);

          _BT_adWidth = _BT_adSize.substring(_BT_start_pos, _BT_end_pos);
          _BT_adHeight = _BT_adSize.split(",").pop();
          _BT_adHeight = _BT_adSize.split("=").pop();

          _BT_injectScript("_BT_BannerObjectDuration");

          var BannerTools = '<div id="_BT_RulerCanvas"></div><div id="_BT_SidePanelNav"> <img class="hvr-bounce-out" id="_BT_Logo"> <div id="_BT_SidePanelNav_Options"> <table> <tr> <td id="_BT_version" class="_BT_Switch_Label">BannerTools</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Disable_Switch"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr></table> <p id="BannerInfo">Banner Info</p><table id="BannerInfoPanel"> <tr> <td>Name:</td><td id="_BT_adNameLabel">Not Found</td></tr><tr> <td>Specs:</td><td id="_BT_adSpecsLabel">Not Found</td></tr><tr> <td>Duration:</td><td id="_BT_adDurationLabel">Not Found</td></tr></table> <button class="_BT_play-button _BT_button" aria-live="assertive" tabindex="32" aria-label="Pause"> <svg width="100%" height="100%" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs> <path id="_BT_12" d="M 11 10 L 17 10 L 17 26 L 11 26 M 20 10 L 26 10 L 26 26 L 20 26"> <animate id="_BT_animation" begin="indefinite" attributeType="XML" attributeName="d" fill="freeze" from="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" to="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28" dur="0.1s" keySplines=".4 0 1 1" repeatCount="1"></animate> </path> </defs> <use xlink:href="#_BT_12" class="_BT_svg-shadow"></use> <use xlink:href="#_BT_12" class="_BT_svg-fill"></use> </svg> </button> <p id="DebugOptions">Tools</p><table id="DebugOptionsPanel"> <tr class="_BT_easter_egg" hidden> <td id="_BT_Override" class="_BT_Switch_Label">Override</td><td class="_BT_Switch_Control"></td></tr><tr class="_BT_easter_egg" hidden> <td id="_BT_Reset" class="_BT_Switch_Label">Reset</td><td class="_BT_Switch_Control"></td></tr><tr class="_BT_easter_egg" hidden> <td class="_BT_Switch_Label">Border All</td><td class="_BT_Switch_Control"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Border_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr class="_BT_easter_egg" hidden> <td class="_BT_Switch_Label">Hide Replay</td><td class="_BT_Switch_Control"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Replay_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Lights Off</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Black_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Margin Top</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Margin_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Reveal All</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Show_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr> <td class="_BT_Switch_Label">Show Guide</td><td class="_BT_Switch_Control hvr-grow"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Guide_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr><tr class="_BT_easter_egg" hidden> <td class="_BT_Switch_Label">Show Toast</td><td class="_BT_Switch_Control"> <label class="_BT_Switch"> <input type="checkbox" id="_BT_Toast_Switch" value="off"> <div class="_BT_Slider _BT_SliderRound"></div></label> </td></tr></table> <button id="_BT_XRuler_Button" class="_BT_Button _BT_RulerButtons hvr-grow">Add X Ruler</button> <button id="_BT_YRuler_Button" class="_BT_Button _BT_RulerButtons hvr-grow">Add Y Ruler</button> <button id="_BT_Ruler_Button" class="_BT_Button _BT_RulerButtons hvr-grow">Clear Rulers</button> <button id="_BT_Screenshot_Button" class="_BT_Button hvr-grow">Screenshot</button> </div></div>';
          $("body").append(BannerTools);

          BannerTools = '<!-- _BT_GridOverlay INJECTED INTO AD-CONTAINER BY BANNERTOOLS SO YOU CAN CLICK ON REPLAY BUTTON WHILE GRID OVERLAYS THE AD-CONTAINER --><br><div id="_BT_GridOverlay"></div>';
          $(".replay-button").before(BannerTools);

          $("#_BT_GridOverlay, #_BT_RulerCanvas").css({
            width: _BT_adWidth,
            height: _BT_adHeight
          });

          $("#_BT_Logo").attr("src", chrome.extension.getURL('/assets/img/Logo.png'));

          $("#_BT_adSpecsLabel").text(_BT_adWidth + " x " + _BT_adHeight);
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
          chrome.storage.sync.get("uniqueID_easterEgg", function (data) {
            if (data["uniqueID_easterEgg"] == "true") {
              $("._BT_easter_egg").toggle();

              chrome.storage.sync.get("uniqueID_replay", function (data) {
                if (data["uniqueID_replay"] == "hidden") {
                  _BT_replay("hidden");
                  $("#_BT_Replay_Switch").prop("checked", true);
                }
              });

              chrome.storage.sync.get("uniqueID_border", function (data) {
                if (data["uniqueID_border"] == "1px solid red") {
                  _BT_border("1px solid red");
                  $("#_BT_Border_Switch").prop("checked", true);
                }
              });

              chrome.storage.sync.get("uniqueID_toast", function (data) {
                if (data["uniqueID_toast"] == 1) {
                  _BT_toast(1);
                  $("#_BT_Toast_Switch").prop("checked", true);
                }
              });

              $("#_BT_version").append(' v' + _BT_version);
            } else {
              $("#_BT_SidePanelNav img").click(function (event) {
                if (_BT_easterEgg < 4) {
                  _BT_easterEgg++;
                }
                if (_BT_easterEgg == 3) {
                  chrome.storage.sync.get("uniqueID_replay", function (data) {
                    if (data["uniqueID_replay"] == "hidden") {
                      _BT_replay("hidden");
                      $("#_BT_Replay_Switch").prop("checked", true);
                    }
                  });

                  chrome.storage.sync.get("uniqueID_border", function (data) {
                    if (data["uniqueID_border"] == 1) {
                      _BT_border("1px solid red");
                      $("#_BT_Border_Switch").prop("checked", true);
                    }
                  });

                  $("._BT_easter_egg").toggle();
                  $("#_BT_version").append(' v' + _BT_version);
                  chrome.storage.sync.set({
                    "uniqueID_easterEgg": "true"
                  });
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
          chrome.storage.sync.get("uniqueID_margin", function (data) {
            if (data["uniqueID_margin"] == "100px") {
              _BT_margin("100px");
              $("#_BT_Margin_Switch").prop("checked", true);
            }
          });

          chrome.storage.sync.get("uniqueID_backgroundColor", function (data) {
            if (data["uniqueID_backgroundColor"] == "rgba(0,0,0,0.8)") {
              _BT_backgroundColor("rgba(0,0,0,0.8)");
              $("#_BT_Black_Switch").prop("checked", true);
            }
          });

          chrome.storage.sync.get("uniqueID_overflow", function (data) {
            if (data["uniqueID_overflow"] == "visible") {
              _BT_overflow("visible");
              $("#_BT_Show_Switch").prop("checked", true);
            }
          });

          chrome.storage.sync.get("uniqueID_guide", function (data) {
            if (data["uniqueID_guide"] == 1) {
              _BT_guide(1);
              $("#_BT_Guide_Switch").prop("checked", true);
            }
          });

          $("#_BT_Disable_Switch").change(function () {
            if (!this.checked) _BT_disable("true");
          });

          $("#_BT_Reset").click(function () {
            chrome.storage.sync.clear();
            location.reload();
          });

          $("#_BT_Override").click(function () {
            chrome.storage.sync.set({
              "uniqueID_override": 1
            });
            location.reload();
          });

          $("#_BT_Guide_Switch").change(function () {
            (this.checked) ? (_BT_guide(1)) : (_BT_guide(0));
          });

          $("#_BT_Border_Switch").change(function () {
            (this.checked) ? (_BT_border("1px solid red")) : (_BT_border(""));
          });

          $("#_BT_Toast_Switch").change(function () {
            (this.checked) ? (_BT_toast(1)) : (_BT_toast(0));
          });

          $("#_BT_Replay_Switch").change(function () {
            (this.checked) ? (_BT_replay("hidden")) : (_BT_replay(""));
          });

          $("#_BT_Margin_Switch").change(function () {
            (this.checked) ? (_BT_margin("100px")) : (_BT_margin(""));
          });

          $("#_BT_Black_Switch").change(function () {
            (this.checked) ? (_BT_backgroundColor("rgba(0,0,0,0.8)")) : (_BT_backgroundColor(""));
          });

          $("#_BT_Show_Switch").change(function () {
            (this.checked) ? (_BT_overflow("visible")) : (_BT_overflow(""));
          });

          $("#_BT_Screenshot_Button").click(function () {
            _BT_screenshot(0);
          });

          var flip = true,
            pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
            play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26",
            $animation = $('#_BT_animation');

          $("._BT_play-button").on('click', function () {
            flip = !flip;
            $animation.attr({
              "from": flip ? pause : play,
              "to": flip ? play : pause
            }).get(0).beginElement();

            if (flip) {
              _BT_injectScript("_BT_BannerObjectPlay");
              $("._BT_play-button").css("fill", "#FFEB3B");
              $("._BT_play-button").css("border", "4px solid #FFEB3B");
            } else {
              _BT_injectScript("_BT_BannerObjectPause");
              $("._BT_play-button").css("fill", "#F44336");
              $("._BT_play-button").css("border", "4px solid #F44336");
            }
          });

          function _BT_getRuler(axis) {
            return '<div class="_BT_Ruler' + axis + ' draggable ui-widget-content"><span class="_BT_RulerPos"></span></div>';
          }

          $("._BT_RulerButtons").click(function (e) {
            if (this.id == "_BT_Ruler_Button") {
              $(".draggable").remove();
              return;
            }
            var axis;
            var maxAxisRange;
            var pos;

            if (this.id == "_BT_XRuler_Button") {
              axis = "X";
              pos = "left";
              maxAxisRange = _BT_adWidth;
            } else {
              axis = "Y";
              pos = "top";
              maxAxisRange = _BT_adHeight;
            }

            $("#_BT_RulerCanvas").append(_BT_getRuler(axis));
            $("._BT_Ruler" + axis).draggable({
              axis: axis,
              containment: "#_BT_RulerCanvas",
              drag: function () {
                var Position = $(this).css(pos);

                if (Position == (maxAxisRange - 1) + "px") {
                  Position = (maxAxisRange + "px");
                }
                $(this).find($('._BT_RulerPos')).text(axis + ': ' + Position);
              }
            });
          });

          _BT_openNav("enabled");
        }
      });
    } else {
      _BT_ToastNotification("BannerTools will remain disabled as it could not find 'ad-container' ID!");
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

  function _BT_toast(_BT_toast_value) {
    _BT_toastEnabled = _BT_toast_value;
    chrome.storage.sync.set({
      "uniqueID_toast": _BT_toast_value
    });
  }

  function _BT_injectScript(_BT_injectScript_value) {
    var script = '<script class="_BT_injectedScript" src="' + chrome.extension.getURL('/assets/js/' + _BT_injectScript_value + '.js') + '"></script>';
    $("body").append(script);
    $("._BT_injectedScript").remove();
  }

  function _BT_Reset() {
    _BT_margin("");
    _BT_replay("");
    _BT_border("");
    _BT_guide(0);
    _BT_toast(0);
    _BT_backgroundColor("");
    _BT_overflow("");
    $("[id*=_Switch]").prop("checked", false);
    _BT_closeNav("disabled");
  }

  function _BT_disable(disable_value) {
    if (disable_value == "true") {
      _BT_Reset();
      chrome.storage.sync.set({
        "uniqueID_disable": "true"
      });
      location.reload();
    }
  }

  function _BT_margin(margin_value) {
    $("body").css("margin", margin_value);
    $("#_BT_RulerCanvas").css("top", margin_value);
    chrome.storage.sync.set({
      "uniqueID_margin": margin_value
    });
  }

  function _BT_replay(replay_value) {
    $(".replay-button").css("visibility", replay_value);
    chrome.storage.sync.set({
      "uniqueID_replay": replay_value
    });
  }

  function _BT_border(border_value) {
    $(".content").children().css("border", border_value);
    $(".content").children().children().css("border", border_value);

    if ($(".draggable").length) {
      $(".draggable").css("border", "1px cyan solid");
    }

    chrome.storage.sync.set({
      "uniqueID_border": border_value
    });
  }

  function _BT_guide(guide_value) {
    if (guide_value == 1) {
      _BT_grid("visible");
      _BT_rulers("block");
    } else {
      _BT_grid("hidden");
      _BT_rulers("none");
    }
    chrome.storage.sync.set({
      "uniqueID_guide": guide_value
    });
  }

  function _BT_grid(grid_value) {
    $("#_BT_GridOverlay").css("visibility", grid_value);
  }

  function _BT_rulers(rulers_value) {
    if (rulers_value == "none") {
      $(".draggable").remove();
    }

    $("#_BT_RulerCanvas").css("display", rulers_value);
    $("._BT_RulerButtons").not("#_BT_Ruler_Button").css("display", rulers_value);
  }

  function _BT_backgroundColor(backgroundColor_value) {
    $("body").css("backgroundColor", backgroundColor_value);
    chrome.storage.sync.set({
      "uniqueID_backgroundColor": backgroundColor_value
    });
  }

  function _BT_overflow(overflow_value) {
    $("#ad-container").css("overflow", overflow_value);
    chrome.storage.sync.set({
      "uniqueID_overflow": overflow_value
    });
  }

  function _BT_screenshot(screenshot_value) {
    if (screenshot_value == 0) {
      _BT_Reset();

      $("#ad-container").css("margin", screenshot_value);
      _BT_replay("hidden");

      var passing_value = "true;" + _BT_adWidth + "@" + _BT_adHeight;

      _BT_injectScript("_BT_BannerObjectLastFrame");
      chrome.runtime.sendMessage({
        resetZoom: "true"
      });
      setTimeout(function () {
        chrome.runtime.sendMessage({
          executeScreenshot: passing_value
        })
      }, 1000);
    } else {
      $("#ad-container").css("margin", "auto");
      _BT_openNav("enabled");
      _BT_replay("");
    }
  }

  function _BT_ToastNotification(_BT_ToastNotification_value) {
    if (_BT_toastEnabled == 0) {
      console.log(_BT_ToastNotification_value);
      return;
    }
    var Toast = '<div id="_BT_ToastMessage">' + _BT_ToastNotification_value + '</div>';
    $("body").append(Toast);
    $("#_BT_ToastMessage").addClass("show");
    setTimeout(function () {
      $("#_BT_ToastMessage").remove();
    }, 3000);
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
    function (request, sender, sendResponse) {
      if (request.ExpandPanel == "true") {
        if (_BT_isInitialized == false) {
          chrome.storage.sync.get("uniqueID_override", function (data) {
            if (data["uniqueID_override"] == 1) {
              _BT_override = 1;
            }
            _BT_initialize(_BT_override);
          });
        } else {
          if (_BT_isExpanded == false) {
            _BT_openNav("maximized");
          } else {
            _BT_closeNav("minimized");
          }
        }
      } else if (request.ExpandPanel == "false") {
        if (_BT_isInitialized == true) {
          _BT_disable("true");
        }
      } else if (request.screenshot == "false") {
        _BT_screenshot(1);
      }
    }
  );

  function _BT_openNav(_BT_openNav_value) {
    _BT_isExpanded = true;
    document.getElementById("_BT_SidePanelNav").style.width = "200px";
    $("#_BT_Disable_Switch").prop("checked", true);
    _BT_ToastNotification("BannerTools has been " + _BT_openNav_value + "!");
  }

  function _BT_closeNav(_BT_closeNav_value) {
    _BT_isExpanded = false;
    document.getElementById("_BT_SidePanelNav").style.width = "0";
    _BT_ToastNotification("BannerTools has been " + _BT_closeNav_value + "! Click on the extension to reopen it!");
  }
});