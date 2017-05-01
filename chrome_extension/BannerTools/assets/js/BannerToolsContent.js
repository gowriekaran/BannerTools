/*
  Created by: Gowriekaran Sinnadurai
  I want to apologize for the nomenclature used.
  I had to make sure they were as unique as possible to avoid potential conflictions.
*/

$(document).ready(function () {
  var _BT_version = "1.7.1";
  var _BT_adWidth, _BT_adHeight, _BT_storage;
  var _BT_easterEgg = _BT_override = _BT_toastEnabled = 0;
  var _BT_isInitialized = _BT_isExpanded = false;

  chrome.storage.sync.get(null, function (items) {
    _BT_storage = items;

    if (items["uniqueID_override"] == 1) {
      _BT_override = 1;
    }
    _BT_initialize(_BT_override);

    if (items["uniqueID_toast"] == 1) {
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
      if (_BT_storage["uniqueID_disable"] == "true") {
        _BT_toastNotification("BannerTools is currently disabled. Click on the extension to launch it!");
      } else {
        _BT_isInitialized = true;

        var _BT_adSize = $("meta[name='ad.size']").attr("content");

        var _BT_start_pos = _BT_adSize.indexOf("=") + 1;
        var _BT_end_pos = _BT_adSize.indexOf(",", _BT_start_pos);

        _BT_adWidth = _BT_adSize.substring(_BT_start_pos, _BT_end_pos);
        _BT_adHeight = _BT_adSize.split(",").pop();
        _BT_adHeight = _BT_adSize.split("=").pop();

        chrome.extension.sendRequest({
          cmd: "get_BT_interior"
        }, function (html) {
          $(".replay-button").before(html);

          $("#_BT_gridOverlay").css({
            width: _BT_adWidth,
            height: _BT_adHeight
          });

          chrome.extension.sendRequest({
            cmd: "get_BT_exterior"
          }, function (html) {
            $("body").append(html);

            _BT_injectScript("_BT_BannerObjectDuration");

            $("#_BT_rulerCanvas").css({
              width: _BT_adWidth,
              height: _BT_adHeight
            });

            $("#_BT_logo").attr("src", chrome.extension.getURL('/assets/img/Logo.png'));
            $("#_BT_screenshotButton").attr("src", chrome.extension.getURL('/assets/img/camera.png'));
            $("#_BT_rewindButton").attr("src", chrome.extension.getURL('/assets/img/rewind.png'));
            $("#_BT_forwardButton").attr("src", chrome.extension.getURL('/assets/img/forward.png'));

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
            if (_BT_storage["uniqueID_easterEgg"] == "true") {
              $("._BT_easterEgg").toggle();

              if (_BT_storage["uniqueID_replay"] == "hidden") {
                _BT_replay("hidden");
                $("#_BT_replaySwitch").prop("checked", true);
              }

              if (_BT_storage["uniqueID_border"] == "1px solid red") {
                _BT_border("1px solid red");
                $("#_BT_borderSwitch").prop("checked", true);
              }

              if (_BT_storage["uniqueID_toast"] == 1) {
                _BT_toast(1);
                $("#_BT_toastSwitch").prop("checked", true);
              }

              $("#_BT_version").append(' v' + _BT_version);
            } else {
              $("#_BT_ img").click(function (event) {
                if (_BT_easterEgg < 4) {
                  _BT_easterEgg++;
                }
                if (_BT_easterEgg == 3) {
                  if (_BT_storage["uniqueID_replay"] == "hidden") {
                    _BT_replay("hidden");
                    $("#_BT_replaySwitch").prop("checked", true);
                  }

                  if (_BT_storage["uniqueID_border"] == 1) {
                    _BT_border("1px solid red");
                    $("#_BT_borderSwitch").prop("checked", true);
                  }

                  $("._BT_easterEgg").toggle();
                  $("#_BT_version").append(' v' + _BT_version);
                  chrome.storage.sync.set({
                    "uniqueID_easterEgg": "true"
                  });
                }
              });
            }
            /*
               _____      _   _                              _    _____      _   _
              / ____|    | | | |                            | |  / ____|    | | | |
             | |  __  ___| |_| |_ ___ _ __    __ _ _ __   __| | | (___   ___| |_| |_ ___ _ __ ___
             | | |_ |/ _ \ __| __/ _ \ '__|  / _` | '_ \ / _` |  \___ \ / _ \ __| __/ _ \ '__/ __|
             | |__| |  __/ |_| ||  __/ |    | (_| | | | | (_| |  ____) |  __/ |_| ||  __/ |  \__ \
              \_____|\___|\__|\__\___|_|     \__,_|_| |_|\__,_| |_____/ \___|\__|\__\___|_|  |___/
            */
            if (_BT_storage["uniqueID_margin"] == "100px") {
              _BT_margin("100px");
              $("#_BT_marginSwitch").prop("checked", true);
            }

            if (_BT_storage["uniqueID_backgroundColor"] == "rgba(0,0,0,0.8)") {
              _BT_backgroundColor("rgba(0,0,0,0.8)");
              $("#_BT_blackSwitch").prop("checked", true);
            }

            if (_BT_storage["uniqueID_overflow"] == "visible") {
              _BT_overflow("visible");
              $("#_BT_showSwitch").prop("checked", true);
            }

            if (_BT_storage["uniqueID_guide"] == 1) {
              _BT_guide(1);
              $("#_BT_guideSwitch").prop("checked", true);
            }

            $("#_BT_disableSwitch").change(function () {
              if (!this.checked) _BT_disable("true");
            });

            $("#_BT_reset").click(function () {
              chrome.storage.sync.clear();
              location.reload();
            });

            $("#_BT_override").click(function () {
              chrome.storage.sync.set({
                "uniqueID_override": 1
              });
              location.reload();
            });

            $("#_BT_guideSwitch").change(function () {
              (this.checked) ? (_BT_guide(1)) : (_BT_guide(0));
            });

            $("#_BT_borderSwitch").change(function () {
              (this.checked) ? (_BT_border("1px solid red")) : (_BT_border(""));
            });

            $("#_BT_toastSwitch").change(function () {
              (this.checked) ? (_BT_toast(1)) : (_BT_toast(0));
            });

            $("#_BT_replaySwitch").change(function () {
              (this.checked) ? (_BT_replay("hidden")) : (_BT_replay(""));
            });

            $("#_BT_marginSwitch").change(function () {
              (this.checked) ? (_BT_margin("100px")) : (_BT_margin(""));
            });

            $("#_BT_blackSwitch").change(function () {
              (this.checked) ? (_BT_backgroundColor("rgba(0,0,0,0.8)")) : (_BT_backgroundColor(""));
            });

            $("#_BT_showSwitch").change(function () {
              (this.checked) ? (_BT_overflow("visible")) : (_BT_overflow(""));
            });

            $("#_BT_screenshotButton").click(function () {
              _BT_screenshot(0);
            });

            var flip = true,
              pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
              play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26",
              $animation = $('#_BT_animation');

            $("#_BT_playButton").on('click', function () {
              flip = !flip;
              $animation.attr({
                "from": flip ? pause : play,
                "to": flip ? play : pause
              }).get(0).beginElement();

              if (flip) {
                _BT_injectScript("_BT_BannerObjectPlay");
              } else {
                _BT_injectScript("_BT_BannerObjectPause");
              }
            });

            $("#_BT_rewindButton").on('click', function () {
              console.log("reverse");
              _BT_injectScript("_BT_BannerObjectReverse");
            });

            $("#_BT_forwardButton").on('click', function () {
              console.log("forward");              
              _BT_injectScript("_BT_BannerObjectPlay");
            });

            function _BT_getRuler(axis) {
              return '<div class="_BT_ruler' + axis + ' draggable ui-widget-content"><span class="_BT_rulerPos"></span></div>';
            }

            $("._BT_rulerButtons").click(function (e) {
              if (this.id == "_BT_ruler_Button") {
                $(".draggable").remove();
                return;
              }
              var axis;
              var maxAxisRange;
              var pos;

              if (this.id == "_BT_xrulerButton") {
                axis = "X";
                pos = "left";
                maxAxisRange = _BT_adWidth;
              } else {
                axis = "Y";
                pos = "top";
                maxAxisRange = _BT_adHeight;
              }

              $("#_BT_rulerCanvas").append(_BT_getRuler(axis));
              $("._BT_ruler" + axis).draggable({
                axis: axis,
                containment: "#_BT_rulerCanvas",
                drag: function () {
                  var Position = $(this).css(pos);

                  if (Position == (maxAxisRange - 1) + "px") {
                    Position = (maxAxisRange + "px");
                  }
                  $(this).find($('._BT_rulerPos')).text(axis + ': ' + Position);
                }
              });
            });

            _BT_openNav("enabled");
          });
        });
      }
    } else {
      _BT_toastNotification("BannerTools will remain disabled as it could not find 'ad-container' ID!");
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

  function _BT_reset() {
    _BT_margin("");
    _BT_replay("");
    _BT_border("");
    _BT_guide(0);
    _BT_toast(0);
    _BT_backgroundColor("");
    _BT_overflow("");
    $("[id*=Switch]").prop("checked", false);
    _BT_closeNav("disabled");
  }

  function _BT_disable(disable_value) {
    if (disable_value == "true") {
      _BT_reset();
      chrome.storage.sync.set({
        "uniqueID_disable": "true"
      });
      location.reload();
    }
  }

  function _BT_margin(margin_value) {
    $("body").css("margin", margin_value);
    $("#_BT_rulerCanvas").css("top", margin_value);
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
    $("#_BT_gridOverlay").css("visibility", grid_value);
  }

  function _BT_rulers(rulers_value) {
    if (rulers_value == "none") {
      $(".draggable").remove();
    }

    $("#_BT_rulerCanvas").css("display", rulers_value);
    $("._BT_rulerButtons").css("display", rulers_value);
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
      _BT_reset();

      $("#ad-container").css("margin", screenshot_value);
      _BT_replay("hidden");

      _BT_injectScript("_BT_BannerObjectLastFrame");
      chrome.extension.sendRequest({
        cmd: "resetZoom"
      });

      setTimeout(function () {
        var matches = [
          _BT_adWidth,
          _BT_adHeight
        ]

        chrome.extension.sendRequest({
          cmd: "screenshot",
          matches: matches
        });
      }, 1000);
    } else {
      $("#ad-container").css("margin", "auto");
      _BT_openNav("enabled");
      _BT_replay("");
    }
  }

  function _BT_toastNotification(_BT_ToastNotification_value) {
    if (_BT_toastEnabled == 0) {
      console.log(_BT_ToastNotification_value);
      return;
    }
    var Toast = '<div id="_BT_toastMessage">' + _BT_ToastNotification_value + '</div>';
    $("body").append(Toast);
    $("#_BT_toastMessage").addClass("show");
    setTimeout(function () {
      $("#_BT_toastMessage").remove();
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
    document.getElementById("_BT_").style.width = "250px";
    $("#_BT_disableSwitch").prop("checked", true);
    _BT_toastNotification("BannerTools has been " + _BT_openNav_value + "!");
  }

  function _BT_closeNav(_BT_closeNav_value) {
    _BT_isExpanded = false;
    document.getElementById("_BT_").style.width = "0";
    _BT_toastNotification("BannerTools has been " + _BT_closeNav_value + "! Click on the extension to reopen it!");
  }
});