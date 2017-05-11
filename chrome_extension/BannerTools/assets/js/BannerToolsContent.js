//  Created by: Gowriekaran Sinnadurai

$(document).ready(function () {
  var _BT_version = "2.0.0 BETA";
  var _BT_adWidth, _BT_adHeight, _BT_storage, _BT_override;
  var _BT_easterEgg = 0;
  var _BT_isInitialized = _BT_isExpanded = false;

  chrome.storage.sync.get(null, function (items) {
    _BT_storage = items;
    items["uniqueID_override"] == 1 ? _BT_override = 1: _BT_override = 0;
    _BT_initialize();
  });

  function _BT_initialize() {
    if ($("#ad-container").length || _BT_override == 1) {
      if (_BT_storage["uniqueID_disable"] == 1 || _BT_storage["uniqueID_minimized"] == 1) {
        var status;
        _BT_storage["uniqueID_disable"] == 1 ? status = "disabled" : status = "minimized";
        console.log("BannerTools is currently " + status + ". Click on the extension to launch it!");
      } else {
        _BT_isInitialized = true;

        if ($("meta[name='ad.size']").lenght){
          var _BT_adSize = $("meta[name='ad.size']").attr("content");
          var _BT_start_pos = _BT_adSize.indexOf("=") + 1;
          var _BT_end_pos = _BT_adSize.indexOf(",", _BT_start_pos);

          _BT_adWidth = _BT_adSize.substring(_BT_start_pos, _BT_end_pos);
          _BT_adHeight = _BT_adSize.split(",").pop();
          _BT_adHeight = _BT_adSize.split("=").pop();
        }
        else{
          console.log("BannerTools could not find meta[name='ad.size']");
        }

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
            _BT_injectScript("_BT_BannerObjectRepeat");
            _BT_injectScript("_BT_BannerObjectTotalDuration");

            $("#_BT_rulerCanvas").css({
              width: _BT_adWidth,
              height: _BT_adHeight
            });

            $("#_BT_logo").attr("src", chrome.extension.getURL('/assets/img/Logo.png'));
            $("#_BT_rewindButton").attr("src", chrome.extension.getURL('/assets/img/rewind.png'));
            $("#_BT_forwardButton").attr("src", chrome.extension.getURL('/assets/img/forward.png'));
            $("#_BT_borderSwitch").children().attr("src", chrome.extension.getURL('/assets/img/border.png'));
            $("#_BT_replaySwitch").children().attr("src", chrome.extension.getURL('/assets/img/repeat.png'));
            $("#_BT_blackSwitch").children().attr("src", chrome.extension.getURL('/assets/img/light.png'));
            $("#_BT_marginSwitch").children().attr("src", chrome.extension.getURL('/assets/img/margin.png'));
            $("#_BT_showSwitch").children().attr("src", chrome.extension.getURL('/assets/img/reveal.png'));
            $("#_BT_guideSwitch").children().attr("src", chrome.extension.getURL('/assets/img/guide.png'));
            $("#_BT_screenshotButton").children().attr("src", chrome.extension.getURL('/assets/img/camera.png'));
            if ($("meta[name='ad.size']").lenght){
              $("#_BT_adSpecsLabel").text(_BT_adWidth + " x " + _BT_adHeight);
            }
            $("#_BT_adNameLabel").text(document.title);

            if (_BT_storage["uniqueID_easterEgg"] == 1) {
              $("._BT_easterEgg").toggle();
              $("#_BT_version").append(' v' + _BT_version);
            } else {
              $("#_BT_ img").click(function (event) {
                if (_BT_easterEgg < 4) {
                  _BT_easterEgg++;
                }
                if (_BT_easterEgg == 3) {
                  $("._BT_easterEgg").toggle();
                  $("#_BT_version").append(' v' + _BT_version);
                  chrome.storage.sync.set({
                    "uniqueID_easterEgg": 1
                  });
                }
              });
            }

            if (_BT_storage["uniqueID_margin"]              == 1) {     feature("#_BT_marginSwitch",0);}
            if (_BT_storage["uniqueID_backgroundColor"]     == 1) {     feature("#_BT_blackSwitch",0);}
            if (_BT_storage["uniqueID_overflow"]            == 1) {     feature("#_BT_showSwitch",0);}
            if (_BT_storage["uniqueID_guide"]               == 1) {     feature("#_BT_guideSwitch",0);}
            if (_BT_storage["uniqueID_border"]              == 1) {     feature("#_BT_borderSwitch",0);}
            if (_BT_storage["uniqueID_replay"]              == 1) {     feature("#_BT_replaySwitch",0);}

            $("#_BT_disableSwitch").change(function () {
              if (!this.checked) _BT_disable(1);
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

            $("._BT_feature").click(function(){
              feature("#" + this.id, $(this).attr('bt-value'));
            });

            function feature(object, arg){
              if(arg == 0){
                arg = 1;
                $(object).addClass("_BT_featureOn");
              }
              else{
                arg = 0;
                $(object).removeClass("_BT_featureOn");
              }
              $(object).attr("bt-value", arg);
              executeFeature(object, arg);
            }

            function executeFeature(object, arg){
              switch (object) {
                case "#_BT_borderSwitch": _BT_border(arg);
                      break;
                case "#_BT_guideSwitch": _BT_guide(arg);
                      break;
                case "#_BT_showSwitch": _BT_overflow(arg);
                      break;
                case "#_BT_marginSwitch": _BT_margin(arg);
                      break;
                case "#_BT_replaySwitch": _BT_replay(arg);
                      break;
                case "#_BT_blackSwitch": _BT_backgroundColor(arg);
                      break;
              }
            }

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
              _BT_injectScript("_BT_BannerObjectReverse");
            });

            $("#_BT_forwardButton").on('click', function () {
              _BT_injectScript("_BT_BannerObjectPlay");
            });

            function _BT_getRuler(axis) {
              return '<div class="_BT_ruler' + axis + ' draggable ui-widget-content"><span class="_BT_rulerPos"></span></div>';
            }

            $("._BT_rulerButtons").click(function (e) {
              console.log("Clicked");
              if (this.id == "_BT_cRulerButton") {
                $(".draggable").remove();
                return;
              }
              var axis;
              var maxAxisRange;
              var pos;

              if (this.id == "_BT_xRulerButton") {
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
      console.log("BannerTools will remain disabled as it could not find 'ad-container' ID!");
    }
  }

  function _BT_injectScript(arg) {
    var script = '<script class="_BT_injectedScript" src="' + chrome.extension.getURL('/assets/js/' + arg + '.js') + '"></script>';
    $("body").append(script);
    $("._BT_injectedScript").remove();
  }

  function _BT_reset() {
    $("[class*=_BT_featureOn]").removeClass("_BT_featureOn");
    _BT_margin(0);
    _BT_replay(0);
    _BT_border(0);
    _BT_guide(0);
    _BT_backgroundColor(0);
    _BT_overflow(0);
    $("[id*=Switch]").prop("checked", false);
    _BT_closeNav(1);
  }

  function _BT_disable(arg) {
    if (arg == 1) {
      _BT_reset();
      chrome.storage.sync.set({
        "uniqueID_disable": arg
      });
      location.reload();
    }
  }

  function _BT_margin(arg) {
    (arg == 1) ? ($("body, #_BT_rulerCanvas").addClass("_BT_marginTop")) : ($("body, #_BT_rulerCanvas").removeClass("_BT_marginTop"));

    chrome.storage.sync.set({
      "uniqueID_margin": arg
    });
  }

  function _BT_replay(arg) {
    (arg == 1) ? ($(".replay-button").css("visibility", "hidden")) : ($(".replay-button").css("visibility", ""));

    chrome.storage.sync.set({
      "uniqueID_replay": arg
    });
  }

  function _BT_border(arg) {
    (arg == 1) ? ($(".content").children().addClass("_BT_border")) : ($(".content").children().removeClass("_BT_border"));
    (arg == 1) ? ($(".content").children().children().addClass("_BT_border")) : ($(".content").children().children().removeClass("_BT_border"));

    if ($(".draggable").length) {
      $(".draggable").removeClass("_BT_border");
    }

    chrome.storage.sync.set({
      "uniqueID_border": arg
    });
  }

  function _BT_guide(arg) {
    _BT_grid(arg);
    _BT_rulers(arg);

    chrome.storage.sync.set({
      "uniqueID_guide": arg
    });
  }

  function _BT_grid(arg) {
    (arg == 1) ? ($("#_BT_gridOverlay").addClass("_BT_visible")) : ($("#_BT_gridOverlay").removeClass("_BT_visible"));
  }

  function _BT_rulers(arg) {
    var style;
    (arg == 1) ? (style = "block") : (style = "");
    if(arg == 0){
      $(".draggable").remove();
    }

    $("#_BT_rulerCanvasm, ._BT_rulerButtons").css("display", style);
  }

  function _BT_backgroundColor(arg) {
    (arg == 1) ? ($("body").addClass("_BT_backgroundColor")) : ($("body").removeClass("_BT_backgroundColor"));
    chrome.storage.sync.set({
      "uniqueID_backgroundColor": arg
    });
  }

  function _BT_overflow(arg) {
    var style;
    (arg == 1) ? (style = "visible") : (style = "");

    $("#ad-container").css("overflow", style);
    chrome.storage.sync.set({
      "uniqueID_overflow": arg
    });
  }

  function _BT_screenshot(arg) {
    if (arg == 0) {
      _BT_reset();

      $("#ad-container").css("margin", 0);
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

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.ExpandPanel == 1) {
        if (_BT_isInitialized == false) {
          chrome.storage.sync.set({
            'uniqueID_disable': 0
          });
          chrome.storage.sync.set({
            'uniqueID_minimized': 0
          });
          chrome.storage.sync.get("uniqueID_override", function (data) {
            if (data["uniqueID_override"] == 1) {
              _BT_override = 1;
            }
            _BT_storage["uniqueID_disable"] = 0;
            _BT_storage["uniqueID_minimized"] = 0;
            _BT_initialize();
          });
        } else {
          if (_BT_isExpanded == false) {
            _BT_openNav("maximized");
          } else {
            _BT_closeNav(0);
          }
        }
      } else if (request.ExpandPanel == 0) {
        if (_BT_isInitialized == true) {
          _BT_disable(1);
        }
      } else if (request.screenshot == 0) {
        _BT_screenshot(1);
      }
    }
  );

  function _BT_openNav(arg) {
    _BT_isExpanded = true;
    $("#_BT_").addClass("_BT_expand");
    $("#_BT_disableSwitch").prop("checked", true);
    console.log("BannerTools has been " + arg + "!");
  }

  function _BT_closeNav(arg) {
    var status;
    if(arg == 0){
      chrome.storage.sync.set({
        "uniqueID_minimized": 1
      });

      status = "minimized";
    }
    else{
      chrome.storage.sync.set({
        "uniqueID_minimized": 0
      });

      status = "disabled";
    }
    _BT_isExpanded = false;
    $("#_BT_").removeClass("_BT_expand");
    console.log("BannerTools has been " + status + "! Click on the extension to reopen it!");
  }

  $("head").prepend('<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">');
})