//  Created by: Gowriekaran Sinnadurai

$(document).ready(function () {
  var _BT_version = "2.0.0 BETA",
      _BT_storage, _BT_helpOn,
      _BT_currentSpeed = 1,
      _BT_isRunning = _BT_isExpanded = false,
      imgs = new Array(),
      flip = imgOverlayFirstRun = initialBoost = true,
      pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
      play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";

  _BT_prepare();

  function _BT_prepare() {
    chrome.storage.sync.get(null, function (items) {
      _BT_storage = items;
      _BT_run();
    });
  }

  function _BT_run() {
    if ($("#ad-container").length || _BT_storage["uniqueID_forceRun"] == 1) {
      if (_BT_storage["uniqueID_disable"] == 1) {
        console.log("BannerTools is currently disabled. Click on the extension to launch it!");
        return;
      }

      $("head").prepend('<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300" rel="stylesheet">');
      $("head").append("<script src='" + chrome.extension.getURL('assets/js/jquery-3.1.1.min.js') + "'></script>");

      if (_BT_storage["isAdGear"] == 1) {
        _BT_appendAssetScript({ script: "_BT_AdGear", remove: 1, arg: "<script class='_BT_injectedScript'>var _BT_adWidth = " + localStorage["adWidth"] + ";var _BT_adHeight = " + localStorage["adHeight"] + ";</script>" });
        return;
      }

      _BT_isRunning = true;
      $("head").append("<script src='" + chrome.extension.getURL('assets/js/jquery-ui.min.js') + "'></script>");
      _BT_appendAssetScript({ script: "_BT_BannerObject" });

      chrome.extension.sendRequest({
        cmd: "_BT_getBT"
      }, function (html) {
        $("body").append(html);
        $("#_BT_logo").attr("src", chrome.extension.getURL('/assets/img/Logo.png'));
        $("#_BT_version").append(' v' + _BT_version);

        if ($("script[src*='" + "https://h5.adgear.com/v1/js/html5.min.js" + "']").length !== 0) {
          console.log("AdGear Banner");
          $("#_BT_").append('<img id="_BT_AdGearLogoButton" class="hvr-grow" src="' + chrome.extension.getURL('/assets/img/adgear2.png') + '"/>');
          $("#_BT_AdGearLogoButton").click(function () {
            setToStorage({ "isAdGear": 1 });
            location.reload();
          });
        }

        $(window).keypress(function (e) {
          switch (e.keyCode) {
            case 0: _BT_animationPlayback(1);
              break;
            case 32: _BT_animationPlayback(1);
              break;
            case 113: _BT_animationPlayback(2);
              break;
            case 101: _BT_animationPlayback(3);
              break;
          }
        });

        $("._BT_featureOverlay").css({ width: localStorage["adWidth"], height: localStorage["adHeight"] });

        $("#_BT_disableSwitch").change(function () {
          _BT_disable();
        });

        $("#_BT_reset").click(function () {
          chrome.storage.sync.clear();
          chrome.storage.local.clear();
          localStorage.clear();
          location.reload();
        });

        $("#_BT_forceRun").click(function () {
          setToStorage({ "uniqueID_forceRun": 1 });
          location.reload();
        });

        $(".replay-button").click(function () {
          _BT_appendTempScript({ function: "firstFrame()" });
        });

        $(document).on('click', '._BT_rulerButtons', function () {
          var axis, maxAxisRange, pos;
          if (this.id == "_BT_xRulerButton") {
            axis = "X";
            pos = "left";
            maxAxisRange = localStorage["adWidth"];
          } else {
            axis = "Y";
            pos = "top";
            maxAxisRange = localStorage["adHeight"];
          }
          $("#_BT_rulerOverlay").append(_BT_getRuler(axis));
          $("._BT_ruler" + axis).draggable({
            axis: axis,
            containment: "#_BT_rulerOverlay",
            drag: function () {
              var Position = $(this).css(pos);

              if (Position == (maxAxisRange - 2) + "px") {
                Position = (maxAxisRange + "px");
              }
              $(this).find($('._BT_rulerPos')).text(axis + ': ' + Position);
            }
          });
        });

        $(document).on('click', '.delImg', function () {
          imgs.splice($(this).parent().attr("id"), 1);
          if ($(this).attr("src") == localStorage['uniqueID_imgOverlay']) {
            localStorage.removeItem('uniqueID_imgOverlay');
            $("#_BT_imgOverlay").attr("src", "");
          }
          $(this).parent().remove();
          if ($('#_BT_imgRefGallery').is(':empty')) {
            _BT_deleteImgOverlayAssets();
          }
        });

        $(document).on('click', '.img', function () {
          $("[class*=_BT_selectedImgOverlay]").removeClass("_BT_selectedImgOverlay");

          if (localStorage['uniqueID_imgOverlay'] == $(this).attr("src")) {
            $("#_BT_imgOverlay").attr("src", "");
            $("#_BT_imgOverlay").removeClass("_BT_visible");
            localStorage.removeItem('uniqueID_imgOverlay');
            $(this).removeClass("_BT_selectedImgOverlay");
          } else {
            $("#_BT_imgOverlay").attr("src", $(this).attr("src"));
            $("#_BT_imgOverlay").addClass("_BT_visible");
            localStorage['uniqueID_imgOverlay'] = $(this).attr("src");
            $(this).addClass("_BT_selectedImgOverlay");
          }
        });

        $(document).on('click', '._BT_feature', function () {
          feature("#" + this.id, $(this).attr('bt-value'));
        });

        $(document).on('mouseover', '._BT_feature, ._BT_rulerButtons', function () {
          if (_BT_helpOn) {
            $("#_BT_helpDesk").addClass("_BT_opacity");
            _BT_appendHelp($(this).attr('bt-featurename'), $(this).attr('bt-featuredesc'));
          }
        });

        $(document).on('mouseout', '._BT_feature, ._BT_rulerButtons', function () {
          if (_BT_helpOn) $("#_BT_helpDesk").removeClass("_BT_opacity");
        });

        $("#_BT_imgOverlayUpload").change(uploadImgOverlayAsset);

        if (!_BT_storage["uniqueID_minimized"]) _BT_storage["uniqueID_minimized"] = 0;

        _BT_openNav(_BT_storage["uniqueID_minimized"]);

        $(document).ready(function () {
          _BT_appendTempScript({ function: "startup()" });
          _BT_appendTempScript({ function: "adSize()" });
          buildFeatureControls();
          buildRulerControls();
        });
      });
    } else {
      console.log("BannerTools will remain disabled as it could not find 'ad-container' ID!");
    }
  }

  function _BT_unpack(arg) {
    if (arg["uniqueID_margin"]                == 1) { feature("#_BT_marginButton",      0); }
    if (arg["uniqueID_backgroundColor"]       == 1) { feature("#_BT_blackButton",       0); }
    if (arg["uniqueID_overflow"]              == 1) { feature("#_BT_showButton",        0); }
    if (arg["uniqueID_guide"]                 == 1) { feature("#_BT_guideButton",       0); }
    if (arg["uniqueID_border"]                == 1) { feature("#_BT_borderButton",      0); }
    if (arg["uniqueID_replay"]                == 1) { feature("#_BT_replayButton",      0); }
    if (arg["uniqueID_help"]                  == 1) { feature("#_BT_helpButton",        0); }
    if (arg["uniqueID_checkpoint"]            == 1) { feature("#_BT_checkpointButton",  0); }
    if (arg["uniqueID_animationBoostValue"]   != 1) { feature("#_BT_boostButton",       0); }
    if (localStorage['uniqueID_imgOverlay'])        { addImgOverlayAsset(localStorage['uniqueID_imgOverlay']); }
  }

  function feature(object, arg) {
    if (arg == 0) {
      arg = 1;
      $(object).children().addClass("_BT_featureOn");
    } else {
      arg = 0;
      $(object).children().removeClass("_BT_featureOn");
    }
    $(object).attr("bt-value", arg);
    getFunction(object, arg);
  }

  function getFunction(object, arg) {
    switch (object) {
      case "#_BT_borderButton": _BT_border(arg);
        break;
      case "#_BT_guideButton": _BT_guide(arg);
        break;
      case "#_BT_showButton": _BT_overflow(arg);
        break;
      case "#_BT_marginButton": _BT_margin(arg);
        break;
      case "#_BT_replayButton": _BT_replay(arg);
        break;
      case "#_BT_blackButton": _BT_backgroundColor(arg);
        break;
      case "#_BT_imgAddRefButton": _BT_imgOverlayAsset();
        break;
      case "#_BT_imgDelRefButton": _BT_deleteImgOverlayAssets();
        break;
      case "#_BT_screenshotButton": _BT_screenshot(0);
        break;
      case "#_BT_playButton": _BT_animationPlayback(1);
        break;
      case "#_BT_firstFrameButton": _BT_animationPlayback(2);
        break;
      case "#_BT_lastFrameButton": _BT_animationPlayback(3);
        break;
      case "#_BT_boostButton": _BT_animationBoost(1);
        break;
      case "#_BT_checkpointButton": _BT_checkpoint(arg);
        break;
      case "#_BT_helpButton": _BT_help(arg);
        break;
    }
  }

  function _BT_appendHelp(name, desc) {
    $("#_BT_featureName").text(name);
    $("#_BT_featureDesc").text(desc);
  }

  function _BT_help(arg) {
    (arg == 1) ? _BT_helpOn = true : _BT_helpOn = false;
    if (!_BT_helpOn) $("#_BT_helpDesk").removeClass("_BT_opacity");
    setToStorage({ "uniqueID_help": arg });
  }

  function uploadImgOverlayAsset() {
    $(this).remove();
    $('<input id="_BT_imgOverlayUpload" type="file" name="filename" accept="image/jpeg, image/png">').change(uploadImgOverlayAsset).appendTo("#_BT_imgOverlayUploadInput");

    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        addImgOverlayAsset(e.target.result);
      };
      reader.readAsDataURL(this.files[0]);
    }
  }

  function _BT_getRuler(axis) {
    return '<div class="_BT_ruler' + axis + ' draggable ui-widget-content"><span class="_BT_rulerPos"></span></div>';
  }

  function buildFeatureControls() {
    var features = [];
    $.getJSON(chrome.extension.getURL('/assets/json/_BT_features.json'), function (data) {
      $.each(data, function (key, val) {
        features.push([
          data[key]["id"],
          data[key]["class"],
          data[key]["svgIcon"],
          data[key]["featureName"],
          data[key]["featureDesc"]
        ]);
      });
      $("#_BT_featureControls").append(buildControls(features, 3));
      _BT_unpack(_BT_storage);
    });
  }

  function buildRulerControls() {
    var features = [];
    $.getJSON(chrome.extension.getURL('/assets/json/_BT_rulers.json'), function (data) {
      $.each(data, function (key, val) {
        features.push([
          data[key]["id"],
          data[key]["class"],
          data[key]["svgIcon"],
          data[key]["featureName"],
          data[key]["featureDesc"]
        ]);
      });
      $("#_BT_rulerOverlayControls>table").append(buildControls(features, 2));
    });
  }

  function buildControls(features, maxFeaturesInRow) {
    var html;
    var openRow = "<tr>";
    var closeRow = "<tr>";
    var featuresInRowCount = 0;

    html = openRow;
    for (var counter = 0; counter < features.length; counter++) {
      var feature = "<td id='" + features[counter][0] + "' class='" + features[counter][1] + "' bt-value='0' bt-featureName='" + features[counter][3] + "'bt-featureDesc='" + features[counter][4] + "'>" + features[counter][2] + "</td>";
      if (featuresInRowCount < 3) {
        html += feature;
      } else {
        html += closeRow + openRow + feature;
        featuresInRowCount = 0;
      }
      featuresInRowCount++;
    }
    html += "</tr>";
    return html;
  }

  function _BT_appendAssetScript(obj) {
    if (typeof obj.remove === 'undefined') {
      obj.remove = "";
    }
    if (typeof obj.arg === 'undefined') {
      obj.arg = "";
    }
    var className = "";
    if (obj.remove == 1) {
      className = "_BT_injectedScript";
    }
    var script = obj.arg + '<script class="' + className + '" src="' + chrome.extension.getURL('/assets/js/' + obj.script + '.js') + '"></script>';
    $("body").append(script);
    if (obj.remove == 1) {
      $("._BT_injectedScript").remove();
    }
  }

  function _BT_appendTempScript(obj) {
    var script = '<script class="_BT_injectedScript">' + obj.function + '</script>';
    $("body").append(script);
    $("._BT_injectedScript").remove();
  }

  function _BT_disable() {
    setToStorage({ "uniqueID_disable": 1 });
    location.reload();
  }

  function _BT_animationPlayback(arg) {
    $(arg).parent().find("svg").removeClass("_BT_featureOn");
    if (arg == 1) {
      flip = !flip;
      $('#_BT_playPause').attr({
        "from": flip ? pause : play,
        "to": flip ? play : pause
      }).get(0).beginElement();

      if (flip) {
        _BT_appendTempScript({ function: "playAnimation()" });
      } else {
        _BT_appendTempScript({ function: "pauseAnimation()" });
        $(arg).children().children().addClass("_BT_featureOn");
      }
      return;
    }
    (arg == 2) ? _BT_appendTempScript({ function: "firstFrame()" }) : _BT_appendTempScript({ function: "lastFrame()" });
  }

  function _BT_imgOverlayAsset() {
    $("#_BT_imgAddRefButton").children().removeClass("_BT_featureOn");
    $("#_BT_imgAddRefButton").attr("bt-value", 0);
    if (!imgOverlayFirstRun) {
      $("#_BT_imgOverlayUpload").change();
    } else {
      $("#_BT_imgOverlayUpload").click();
    }
  }

  function addImgOverlayAsset(arg) {
    imgs.push(arg);
    $("#_BT_imgRefGallery").append(getImgContainer({ imgSrc: imgs[imgs.length - 1], id: imgs.length - 1 }));

    if (imgs.length - 1 < 1) {
      $("#_BT_imgDelRefButton, #_BT_imgRefGalleryContainer").addClass("_BT_visible");
      $("#_BT_imgOverlay").attr("src", imgs[imgs.length - 1]);
      $("#_BT_imgOverlay").addClass("_BT_visible");
      localStorage['uniqueID_imgOverlay'] = imgs[imgs.length - 1];
      $(".imgContainer > .img").addClass("_BT_selectedImgOverlay");
    }
    $("#_BT_imgRefGallery").width(imgs.length * 87 + "px");
  }

  function _BT_deleteImgOverlayAssets() {
    imgs = new Array();
    $("#_BT_imgRefGallery").empty();
    $("#_BT_imgOverlay").attr("src", "");
    $("#_BT_imgOverlay, #_BT_imgDelRefButton, #_BT_imgRefGalleryContainer").removeClass("_BT_visible");
    localStorage.removeItem('uniqueID_imgOverlay');
  }

  function getImgContainer(object) {
    var html = '<div class="imgContainer" id=' + object.id + '><img class="img" src="' + object.imgSrc + '" alt=""><span class="delImg">&#x2716</span></div>';
    return html;
  }

  function _BT_replay(arg) {
    (arg == 1) ? ($(".replay-button").css("visibility", "hidden")) : ($(".replay-button").css("visibility", ""));

    setToStorage({ "uniqueID_replay": arg });
  }

  function _BT_checkpoint(arg) {
    _BT_appendTempScript({ function: "checkpoint();" });

    setToStorage({ "uniqueID_checkpoint": arg });
  }

  function _BT_margin(arg) {
    (arg == 1) ? ($("body, ._BT_featureOverlay").addClass("_BT_marginTop")) : ($("body, ._BT_featureOverlay").removeClass("_BT_marginTop"));

    setToStorage({ "uniqueID_margin": arg });
  }

  function _BT_border(arg) {
    (arg == 1) ? ($(".content").children().addClass("_BT_border")) : ($(".content").children().removeClass("_BT_border"));
    (arg == 1) ? ($(".content").children().children().addClass("_BT_border")) : ($(".content").children().children().removeClass("_BT_border"));

    if (arg == 1) {
      $(".content").children().each(function () {
        if ($(this).width() == 0 || $(this).height() == 0) {
          $(this).removeClass("_BT_border");
        }
      });

      $(".content").children().children().each(function () {
        if ($(this).width() == 0 || $(this).height() == 0) {
          $(this).removeClass("_BT_border");
        }
      });
    }

    if ($(".draggable").length) {
      $(".draggable").removeClass("_BT_border");
    }

    setToStorage({ "uniqueID_border": arg });
  }

  function _BT_guide(arg) {
    _BT_grid(arg);
    _BT_rulers(arg);
    setToStorage({ "uniqueID_guide": arg });
  }

  function _BT_grid(arg) {
    (arg == 1) ? ($("#_BT_gridOverlay").addClass("_BT_visible")) : ($("#_BT_gridOverlay").removeClass("_BT_visible"));
    (arg == 1) ? ($(".replay-button").css("z-index", "10000")) : ($(".replay-button").css("z-index", ""));
  }

  function _BT_rulers(arg) {
    var style;
    (arg == 1) ? ($("#_BT_rulerOverlay, #_BT_rulerOverlayControls").addClass("_BT_visible")) : ($("#_BT_rulerOverlay, #_BT_rulerOverlayControls").removeClass("_BT_visible"));
    if (arg == 0) {
      $(".draggable").remove();
    }
  }

  function _BT_backgroundColor(arg) {
    (arg == 1) ? ($("body").addClass("_BT_backgroundColor")) : ($("body").removeClass("_BT_backgroundColor"));
    setToStorage({ "uniqueID_backgroundColor": arg });
  }

  function _BT_overflow(arg) {
    var style;
    (arg == 1) ? (style = "visible") : (style = "");
    $("#ad-container").css("overflow", style);
    setToStorage({ "uniqueID_overflow": arg });
  }

  function _BT_animationBoost(arg) {
    $("#_BT_boostButton").children().removeClass("_BT_featureOn");
    $("#_BT_currentSpeed").removeClass("_BT_warning");
    if (arg == 0) {
      _BT_currentSpeed = 1;
    } else {
      if (_BT_storage["uniqueID_animationBoostValue"]) {
        console.log("i got some", _BT_storage["uniqueID_animationBoostValue"]);
        _BT_currentSpeed = _BT_storage["uniqueID_animationBoostValue"];
      }
      if (!initialBoost) {
        var _BT_nextSpeed;
        if (_BT_currentSpeed == 0.5) _BT_nextSpeed = 1;
        else if (_BT_currentSpeed == 1) _BT_nextSpeed = 2;
        else if (_BT_currentSpeed == 2) _BT_nextSpeed = 5;
        else if (_BT_currentSpeed == 5) _BT_nextSpeed = 10;
        else _BT_nextSpeed = 0.5;
        _BT_currentSpeed = _BT_nextSpeed;
      } else {
        initialBoost = false;
      }

      if (_BT_currentSpeed != 1) {
        $("#_BT_boostButton").children().addClass("_BT_featureOn");
        $("#_BT_currentSpeed").addClass("_BT_warning");
      }
    }
    var suffix = ".0";
    if (_BT_currentSpeed == 0.5) suffix = "";
    $("#_BT_currentSpeed").text("Speed: x" + _BT_currentSpeed + suffix);
    _BT_appendTempScript({ function: "boost(" + _BT_currentSpeed + ");" });
    setToStorage({ "uniqueID_animationBoostValue": _BT_currentSpeed });
  }

  function _BT_screenshot(arg) {
    $("#_BT_screenshotButton").children().removeClass("_BT_featureOn");
    if (arg == 0) {
      var _BT_storageJSON = JSON.stringify(_BT_storage);
      localStorage['_BT_storageJSON'] = _BT_storageJSON;

      if (localStorage['uniqueID_checkpoint']) {
        localStorage['uniqueID_checkpointBackup'] = localStorage['uniqueID_checkpoint'];
        localStorage.removeItem('uniqueID_checkpoint');
      }

      if (localStorage['uniqueID_imgOverlay']) {
        localStorage['uniqueID_imgOverlayBackup'] = localStorage['uniqueID_imgOverlay'];
        localStorage.removeItem('uniqueID_imgOverlay');
      }

      feature("#_BT_marginButton", 1);
      feature("#_BT_blackButton", 1);
      feature("#_BT_showButton", 1);
      feature("#_BT_guideButton", 1);
      feature("#_BT_borderButton", 1);
      feature("#_BT_replayButton", 1);
      feature("#_BT_helpButton", 1);
      _BT_animationBoost(0);
      initialBoost = true;
      _BT_deleteImgOverlayAssets();
      _BT_closeNav(1);

      $("#ad-container").css("margin", 0);
      _BT_replay(1);

      chrome.extension.sendRequest({
        cmd: "_BT_resetZoom"
      });

      setTimeout(function () {
        var specs = [
          localStorage["adWidth"],
          localStorage["adHeight"]
        ];

        chrome.extension.sendRequest({
          cmd: "_BT_screenshot",
          specs: specs
        });
      }, 1250);
    } else {
      _BT_storage = JSON.parse(localStorage['_BT_storageJSON']);
      _BT_unpack(_BT_storage);

      if (localStorage['uniqueID_checkpointBackup']) {
        localStorage['uniqueID_checkpoint'] = localStorage['uniqueID_checkpointBackup'];
        localStorage.removeItem('uniqueID_checkpointBackup');
      }

      if (localStorage['uniqueID_imgOverlayBackup']) {
        localStorage['uniqueID_imgOverlay'] = localStorage['uniqueID_imgOverlayBackup'];
        localStorage.removeItem('uniqueID_imgOverlayBackup');
      }

      localStorage.removeItem('_BT_storageJSON');
      $("#ad-container").css("margin", "auto");
      _BT_openNav(_BT_storage["uniqueID_minimized"]);
    }
  }

  function setToStorage(obj) {
    chrome.storage.sync.set(obj);
    _BT_storage[obj.key] = obj.val;
  }

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request._BT_pluginClick == 1) {
        if (_BT_isRunning == false) {
          setToStorage({ "uniqueID_disable": 0 });
          setToStorage({ "uniqueID_minimized": 0 });
          _BT_prepare();
        } else {
          if (_BT_isExpanded == false) {
            setToStorage({ "uniqueID_minimized": 0 });
            _BT_openNav(0);
          } else {
            _BT_closeNav(0);
          }
        }
      } else if (request._BT_pluginClick == 0) {
        if (_BT_isRunning == true) {
          _BT_disable();
        }
      } else if (request._BT_screenshot == 0) {
        _BT_screenshot(1);
      }
    }
  );

  function _BT_openNav(arg) {
    var status;
    (arg == 0) ? status = "maximized" : status = "minimized";
    if (arg == 0) {
      _BT_isExpanded = true;
      $("#_BT_").addClass("_BT_expand");
      $("#_BT_disableSwitch").prop("checked", true);
      setToStorage({ "uniqueID_minimized": 0 });
    }
    console.log("BannerTools has been " + status + "!");
  }

  function _BT_closeNav(arg) {
    var status;
    setToStorage({ "uniqueID_minimized": 1 });
    (arg == 0) ? status = "minimized" : status = "disabled";
    _BT_isExpanded = false;
    $("#_BT_").removeClass("_BT_expand");
    console.log("BannerTools has been " + status + "! Click on the extension to reopen it!");
  }
});