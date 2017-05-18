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

        if ($("meta[name='ad.size']").length){
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
          cmd: "get_BT_"
        }, function (html) {
          $("body").append(html);
          $("head").append("<script src='" + chrome.extension.getURL('assets/js/jquery-3.1.1.min.js') + "'></script>");
          $("head").append("<script src='" + chrome.extension.getURL('assets/js/jquery-ui.min.js') + "'></script>");

          _BT_injectScript({script: "_BT_BannerObjectProgress"});
          _BT_injectScript({script:"_BT_BannerObjectDuration", remove: 1});
          _BT_injectScript({script:"_BT_BannerObjectRepeat", remove: 1});
          _BT_injectScript({script:"_BT_BannerObjectTotalDuration", remove: 1});

          $("._BT_featureOverlay").css({
            width: _BT_adWidth,
            height: _BT_adHeight
          });

          if(localStorage['uniqueID_imgOverlay']){
            _BT_imgRef({arg: 1, data: localStorage['uniqueID_imgOverlay']});
          }

          $("#_BT_logo").attr("src", chrome.extension.getURL('/assets/img/Logo.png'));
          if ($("meta[name='ad.size']").length){
            $("#_BT_adSpecsLabel").text(_BT_adWidth + " x " + _BT_adHeight);
          }
          $("#_BT_adNameLabel").text(document.title.split('-')[0]);

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
              $(object).children().addClass("_BT_featureOn");
            }
            else{
              arg = 0;
              $(object).children().removeClass("_BT_featureOn");
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
              case "#_BT_imgAddRefButton": $('#_BT_imgOverlayUpload').click();
                    break;
              case "#_BT_imgDelRefButton": _BT_imgRef({arg: 0, data: null});
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
            $(this).parent().find("svg").removeClass("_BT_featureOn");
            $(this).children().find("svg").addClass("_BT_featureOn");
            flip = !flip;
            $animation.attr({
              "from": flip ? pause : play,
              "to": flip ? play : pause
            }).get(0).beginElement();

            if (flip) {
              _BT_injectScript({script:"_BT_BannerObjectPlay", remove: 1});
            } else {
              _BT_injectScript({script:"_BT_BannerObjectPause", remove: 1});
            }
          });

          $("#_BT_rewindButton").on('click', function () {
            _BT_injectScript({script:"_BT_BannerObjectReverse", remove: 1});
            $(this).parent().find("svg").removeClass("_BT_featureOn");
            $(this).children().addClass("_BT_featureOn");
          });

          $("#_BT_forwardButton").on('click', function () {
            _BT_injectScript({script:"_BT_BannerObjectPlay", remove: 1});
            $(this).parent().find("svg").removeClass("_BT_featureOn");
            $(this).children().addClass("_BT_featureOn");
          });

          function _BT_getRuler(axis) {
            return '<div class="_BT_ruler' + axis + ' draggable ui-widget-content"><span class="_BT_rulerPos"></span></div>';
          }

          $("._BT_rulerButtons").click(function (e) {
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
            $("#_BT_rulerOverlay").append(_BT_getRuler(axis));
            $("._BT_ruler" + axis).draggable({
              axis: axis,
              containment: "#_BT_rulerOverlay",
              drag: function () {
                var Position = $(this).css(pos);

                if (Position == (maxAxisRange - 1) + "px") {
                  Position = (maxAxisRange + "px");
                }
                $(this).find($('._BT_rulerPos')).text(axis + ': ' + Position);
              }
            });
          });

          $("#_BT_imgOverlayUpload").change(function() {
            if (this.files && this.files[0]) {
              var reader = new FileReader();
              reader.onload = function (e) {
                  _BT_imgRef({arg: 1, data: e.target.result});
              };
              reader.readAsDataURL(this.files[0]);
            }
          });

          _BT_openNav("enabled");
        });
      }
    } else {
      console.log("BannerTools will remain disabled as it could not find 'ad-container' ID!");
    }
  }

  function _BT_injectScript(obj) {
    if(typeof obj.remove === 'undefined'){
      obj.remove = "";
    }
    if(typeof obj.arg === 'undefined'){
      obj.arg = "";
    }
    var className = "";
    if (obj.remove == 1){
      className = "_BT_injectedScript";
    }
    var script = obj.arg + '<script class="' + className + '" src="' + chrome.extension.getURL('/assets/js/' + obj.script + '.js') + '"></script>';
    $("body").append(script);
    if (obj.remove == 1){
      $("._BT_injectedScript").remove();
    }
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

  function _BT_imgRef(obj){
    (obj.arg == 1) ? ($("#_BT_imgOverlay").attr("src", obj.data)) : ($("#_BT_imgOverlay").attr("src", ""));
    (obj.arg == 1) ? ($("#_BT_imgOverlay").addClass("_BT_visible")) : ($("#_BT_imgOverlay").removeClass("_BT_visible"));
    (obj.arg == 1) ? ($("#_BT_imgDelRefButton").addClass("_BT_visible")) : ($("#_BT_imgDelRefButton").removeClass("_BT_visible"));
    (obj.arg == 1) ? (localStorage["uniqueID_imgOverlay"] = obj.data) : (localStorage.removeItem("uniqueID_imgOverlay"));
    if(obj.arg == 0){
      $("#_BT_imgAddRefButton").children().removeClass("_BT_featureOn");
      $("#_BT_imgAddRefButton").attr("bt-value", obj.arg);
    }
  }

  function _BT_replay(arg) {
    (arg == 1) ? ($(".replay-button").css("visibility", "hidden")) : ($(".replay-button").css("visibility", ""));

    chrome.storage.sync.set({
      "uniqueID_replay": arg
    });
  }

  function _BT_margin(arg) {
    (arg == 1) ? ($("body, ._BT_featureOverlay").addClass("_BT_marginTop")) : ($("body, ._BT_featureOverlay").removeClass("_BT_marginTop"));

    chrome.storage.sync.set({
      "uniqueID_margin": arg
    });
  }

  function _BT_border(arg) {
    (arg == 1) ? ($(".content").children().addClass("_BT_border")) : ($(".content").children().removeClass("_BT_border"));
    (arg == 1) ? ($(".content").children().children().addClass("_BT_border")) : ($(".content").children().children().removeClass("_BT_border"));

    if(arg == 1){
      $(".content").children().each(function(){
        if($(this).width() == 0 || $(this).height() == 0 ){
          $(this).removeClass("_BT_border");
        }
      });

      $(".content").children().children().each(function(){
        if($(this).width() == 0 || $(this).height() == 0 ){
          $(this).removeClass("_BT_border");
        }
      });
    }

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
    (arg == 1) ? ($(".replay-button").css("z-index", "10000")) : ($(".replay-button").css("z-index", ""));
  }

  function _BT_rulers(arg) {
    var style;
    (arg == 1) ? ($("#_BT_rulerOverlay, #_BT_rulerOverlayControls").addClass("_BT_visible")) : ($("#_BT_rulerOverlay, #_BT_rulerOverlayControls").removeClass("_BT_visible"));
    if(arg == 0){
      $(".draggable").remove();
    }
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

      _BT_injectScript({script:"_BT_BannerObjectLastFrame", remove: 1});
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

  $("head").prepend('<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300" rel="stylesheet">');
})