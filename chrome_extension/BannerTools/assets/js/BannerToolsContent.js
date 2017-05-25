//  Created by: Gowriekaran Sinnadurai

$(document).ready(function () {
  var _BT_version = "2.0.0 BETA";
  var _BT_adWidth, _BT_adHeight, _BT_storage, _BT_override;
  var _BT_easterEgg = 0;
  var _BT_isInitialized = _BT_isExpanded = false;
  var imgOverlayFirstRun = true;
  var imgs = new Array();
  var flip = true,
      pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
      play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";

  var lastHoveredElement;

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

        $(function () {
          if (document.location.href.indexOf('stag') > -1) {
            console.log("Stage environment");
            console.log("Logging all mouseover events");
            $('.item').mouseover(function () {
              console.log($(this));
              lastHoveredElement = $(this);
            });
          }
        });

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
          $("head").prepend('<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300" rel="stylesheet">');

          _BT_injectScript({script: "_BT_HijackObject"});

          $("._BT_featureOverlay").css({
            width: _BT_adWidth,
            height: _BT_adHeight
          });

          $("#_BT_logo").attr("src", chrome.extension.getURL('/assets/img/Logo.png'));
          var _BT_adSize = "";
          if ($("meta[name='ad.size']").length){
            _BT_adSize = "(" + _BT_adWidth + " x " + _BT_adHeight + ")";
          }
          $("#_BT_adNowPlaying").text(document.title.split('-')[0] + _BT_adSize);

          buildFeatureControls();
          buildRulerControls();

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
          if(localStorage['uniqueID_imgOverlay']){
            addImgOverlayAsset(localStorage['uniqueID_imgOverlay']);
            $("#_BT_imgOverlay").attr("src", localStorage['uniqueID_imgOverlay']);
            $("#_BT_imgOverlay, #_BT_imgDelRefButton, #_BT_imgRefGalleryContainer").addClass("_BT_visible");
            $('#_BT_imgRefGallery .img').addClass("_BT_selectedImgOverlay");
          }

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

          $(".replay-button").click(function(){
            _BT_injectScript({script:"_BT_BannerObjectFirstFrame", remove: 1})
          });

          $(document).on('click', '.delImg', function() {
            imgs.splice($(this).parent().attr("id"), 1);
            if($(this).attr("src") == localStorage['uniqueID_imgOverlay']){
              localStorage.removeItem('uniqueID_imgOverlay');
              $("#_BT_imgOverlay").attr("src", "");
            }
            $(this).parent().remove();
            if ($('#_BT_imgRefGallery').is(':empty')){
              _BT_deleteImgOverlayAssets();
            }
          });

          $(document).on('click', '.img', function() {
            $("[class*=_BT_selectedImgOverlay]").removeClass("_BT_selectedImgOverlay");

            if(localStorage['uniqueID_imgOverlay'] == $(this).attr("src")){
              localStorage.removeItem('uniqueID_imgOverlay');
              $("#_BT_imgOverlay").attr("src", "");
              $(this).removeClass("_BT_selectedImgOverlay");
            }

            else{
              $("#_BT_imgOverlay").attr("src", $(this).attr("src"));
              $("#_BT_imgOverlay").addClass("_BT_visible");
              localStorage['uniqueID_imgOverlay'] = $(this).attr("src");
              $(this).addClass("_BT_selectedImgOverlay");
            }
          });

          function uploadImgOverlayAsset(){
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

          $("#_BT_imgOverlayUpload").change(uploadImgOverlayAsset);

          _BT_openNav("enabled");
        });
      }
    } else {
      console.log("BannerTools will remain disabled as it could not find 'ad-container' ID!");
    }
  }

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
      case "#_BT_imgAddRefButton": _BT_imgOverlayAsset();
            break;
      case "#_BT_imgDelRefButton": _BT_deleteImgOverlayAssets();
            break;
      case "#_BT_screenshotButton": _BT_screenshot(0);
            break;
      case "#_BT_playButton": _BT_animationPlayback(object);
            break;
      case "#_BT_firstFrameButton": _BT_animationPlayback(object);
            break;
      case "#_BT_lastFrameButton": _BT_animationPlayback(object);
            break;
      case "#_BT_boostButton": _BT_animationBoost(arg);
        break;
    }
  }

  function _BT_getRuler(axis) {
    return '<div class="_BT_ruler' + axis + ' draggable ui-widget-content"><span class="_BT_rulerPos"></span></div>';
  }

  function buildFeatureControls(){
    var features =  [
                      [
                        "_BT_firstFrameButton",
                        "_BT_feature _BT_featureOff",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="transform: scaleX(-1);"><path d="M19 12l-18 12v-24l18 12zm4-11h-4v22h4v-22z"/></svg>'
                      ],
                      [
                        "_BT_playButton",
                        "_BT_feature _BT_featureOff",
                        '<button aria-live="assertive" tabindex="32" aria-label="Pause"> <svg viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs> <path id="_BT_12" d="M 11 10 L 17 10 L 17 26 L 11 26 M 20 10 L 26 10 L 26 26 L 20 26"> <animate id="_BT_playPause" begin="indefinite" attributeType="XML" attributeName="d" fill="freeze" from="M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26" to="M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28" dur="0.1s" keySplines=".4 0 1 1" repeatCount="1"></animate> </path> </defs> <use xlink:href="#_BT_12" class="_BT_svg-shadow"></use> <use xlink:href="#_BT_12" class="_BT_svg-fill"></use> </svg> </button>'
                      ],
                      [
                        "_BT_lastFrameButton",
                        "_BT_feature _BT_featureOff",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M19 12l-18 12v-24l18 12zm4-11h-4v22h4v-22z"/> </svg>'
                      ],
                      [
                        "_BT_borderSwitch",
                        "_BT_feature _BT_featureOff",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path d="M16 0v2h-8v-2h8zm0 24v-2h-8v2h8zm2-22h4v4h2v-6h-6v2zm-18 14h2v-8h-2v8zm2-10v-4h4v-2h-6v6h2zm22 2h-2v8h2v-8zm-2 10v4h-4v2h6v-6h-2zm-16 4h-4v-4h-2v6h6v-2z"/> </svg>'
                      ],
                      [
                        "_BT_replaySwitch",
                        "_BT_feature _BT_featureOff",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path d="M12 0c-3.31 0-6.291 1.353-8.459 3.522l-2.48-2.48-1.061 7.341 7.437-.966-2.489-2.488c1.808-1.808 4.299-2.929 7.052-2.929 5.514 0 10 4.486 10 10s-4.486 10-10 10c-3.872 0-7.229-2.216-8.89-5.443l-1.717 1.046c2.012 3.803 6.005 6.397 10.607 6.397 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/> </svg>'
                      ],
                      [
                        "_BT_blackSwitch",
                        "_BT_feature _BT_featureOff",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path d="M14 19h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm.25 2h-4.5l1.188.782c.154.138.38.218.615.218h.895c.234 0 .461-.08.615-.218l1.187-.782zm3.75-13.799c0 3.569-3.214 5.983-3.214 8.799h-5.572c0-2.816-3.214-5.23-3.214-8.799 0-3.723 2.998-5.772 5.997-5.772 3.001 0 6.003 2.051 6.003 5.772zm4-.691v1.372h-2.538c.02-.223.038-.448.038-.681 0-.237-.017-.464-.035-.69h2.535zm-10.648-6.553v-1.957h1.371v1.964c-.242-.022-.484-.035-.726-.035-.215 0-.43.01-.645.028zm5.521 1.544l1.57-1.743 1.019.918-1.603 1.777c-.25-.297-.593-.672-.986-.952zm-10.738.952l-1.603-1.777 1.019-.918 1.57 1.743c-.392.28-.736.655-.986.952zm-1.597 5.429h-2.538v-1.372h2.535c-.018.226-.035.454-.035.691 0 .233.018.458.038.681z"/> </svg>'
                      ],
                      [
                        "_BT_marginSwitch",
                        "_BT_feature _BT_featureOff",
                        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"> <path d="M32 16c0-8.837-7.163-16-16-16s-16 7.163-16 16 7.163 16 16 16 16-7.163 16-16zM3 16c0-7.18 5.82-13 13-13s13 5.82 13 13-5.82 13-13 13-13-5.82-13-13z"></path> <path d="M9.914 11.086l-2.829 2.829 8.914 8.914 8.914-8.914-2.828-2.828-6.086 6.086z"></path> </svg>'
                      ],
                      [
                        "_BT_showSwitch",
                        "_BT_feature _BT_featureOff",
                        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"> <path d="M16 6c-6.979 0-13.028 4.064-16 10 2.972 5.936 9.021 10 16 10s13.027-4.064 16-10c-2.972-5.936-9.021-10-16-10zM23.889 11.303c1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79 3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303s-5.527-0.796-7.889-2.303c-1.88-1.199-3.473-2.805-4.67-4.697 1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 4.418 3.582 8 8 8s8-3.582 8-8c0-0.962-0.17-1.883-0.482-2.737 0.124 0.074 0.248 0.15 0.371 0.228v0zM16 13c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path> </svg>'
                      ],
                      [
                        "_BT_guideSwitch",
                        "_BT_feature _BT_featureOff",
                        ' <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path d="M6 6h-6v-6h6v6zm9-6h-6v6h6v-6zm9 0h-6v6h6v-6zm-18 9h-6v6h6v-6zm9 0h-6v6h6v-6zm9 0h-6v6h6v-6zm-18 9h-6v6h6v-6zm9 0h-6v6h6v-6zm9 0h-6v6h6v-6z"/> </svg>'
                      ],
                      [
                        "_BT_screenshotButton",
                        "_BT_feature _BT_featureOff",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path d="M18 5l-2-3h-8l-2 3h-6v17h24v-17h-6zm4 7h-4.079c.581 3.754-2.312 7-5.921 7-3.612 0-6.501-3.248-5.921-7h-4.079v-5h5.07l2-3h5.859l2 3h5.071v5zm-10-3c-2.243 0-4 1.73-4 3.939 0 2.239 1.794 4.061 4 4.061s4-1.822 4-4.061c0-2.209-1.757-3.939-4-3.939zm-.436 3.555c-.632.503-1.461.5-1.852-.006-.39-.506-.194-1.324.438-1.827.632-.502 1.461-.499 1.851.007.391.505.195 1.323-.437 1.826z"/> </svg>'
                      ],
                      [
                        "_BT_boostButton",
                        "_BT_feature _BT_featureOff",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M15.91 13.34l2.636-4.026-.454-.406-3.673 3.099c-.675-.138-1.402.068-1.894.618-.736.823-.665 2.088.159 2.824.824.736 2.088.665 2.824-.159.492-.55.615-1.295.402-1.95zm-3.91-10.646v-2.694h4v2.694c-1.439-.243-2.592-.238-4 0zm8.851 2.064l1.407-1.407 1.414 1.414-1.321 1.321c-.462-.484-.964-.927-1.5-1.328zm-18.851 4.242h8v2h-8v-2zm-2 4h8v2h-8v-2zm3 4h7v2h-7v-2zm21-3c0 5.523-4.477 10-10 10-2.79 0-5.3-1.155-7.111-3h3.28c1.138.631 2.439 1 3.831 1 4.411 0 8-3.589 8-8s-3.589-8-8-8c-1.392 0-2.693.369-3.831 1h-3.28c1.811-1.845 4.321-3 7.111-3 5.523 0 10 4.477 10 10z"/></svg>'
                      ],
                      [
                        "_BT_imgAddRefButton",
                        "_BT_feature _BT_featureOff",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path d="M1.859 6l-.489-2h21.256l-.491 2h-20.276zm1.581-4l-.439-2h17.994l-.439 2h-17.116zm20.56 16h-24l2 6h20l2-6zm-20.896-2l-.814-6h19.411l-.839 6h2.02l1.118-8h-24l1.085 8h2.019zm2.784-3.995c-.049-.555.419-1.005 1.043-1.005.625 0 1.155.449 1.185 1.004.03.555-.438 1.005-1.044 1.005-.605 0-1.136-.449-1.184-1.004zm7.575-.224l-1.824 2.68-1.813-1.312-2.826 2.851h10l-3.537-4.219z"/> </svg>'
                      ],
                      [
                        "_BT_imgDelRefButton",
                        "_BT_feature _BT_featureOff",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path d="M19.5 12c-2.483 0-4.5 2.015-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.017-4.5-4.5-4.5zm2.5 5h-5v-1h5v1zm-18 0l4-5.96 2.48 1.96 2.52-4 1.853 2.964c-1.271 1.303-1.977 3.089-1.827 5.036h-9.026zm10.82 4h-14.82v-18h22v7.501c-.623-.261-1.297-.422-2-.476v-5.025h-18v14h11.502c.312.749.765 1.424 1.318 2zm-9.32-11c-.828 0-1.5-.671-1.5-1.5 0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5z"/> </svg>'
                      ]
                    ];

    $("#_BT_featureControls").append(buildControls(features, 3));
  }

  function buildRulerControls(){
    var features =  [
                      [
                        "_BT_xRulerButton",
                        "_BT_rulerButtons",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path d="M24 24v-8h-24v8h24zm-22-6h2v2h1v-2h2v3h1v-3h2v2h1v-2h2v2h1v-2h2v3h1v-3h2v2h1v-2h2v4h-20v-4zm14-10h-8v4l-8-6 8-6v4h8v-4l8 6-8 6v-4z"/> </svg>'
                      ],
                      [
                        "_BT_yRulerButton",
                        "_BT_rulerButtons",
                        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"> <path d="M24 0h-8v24h8v-24zm-6 22v-2h2v-1h-2v-2h3v-1h-3v-2h2v-1h-2v-2h2v-1h-2v-2h3v-1h-3v-2h2v-1h-2v-2h4v20h-4zm-10-14v8h4l-6 8-6-8h4v-8h-4l6-8 6 8h-4z"/> </svg>'
                      ]
                    ];

    $("#_BT_rulerOverlayControls>table").append(buildControls(features, 2));
  }

  function buildControls(features, maxFeaturesInRow){
    var html;
    var openRow = "<tr>";
    var closeRow = "<tr>";
    var featuresInRowCount = 0;

    html = openRow;
    for (var counter = 0; counter < features.length; counter++){
      var feature = "<td id='" + features[counter][0] + "' class='" + features[counter][1] + "' bt-value='0'>" + features[counter][2] + "</td>";
      if(featuresInRowCount < 3){
        html += feature;
      }
      else{
        html += closeRow + openRow + feature;
        featuresInRowCount = 0;
      }
      featuresInRowCount++;
    }
    html += "</tr>";
    return html;
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
    localStorage.removeItem('uniqueID_imgOverlay');
    localStorage.removeItem('uniqueID_checkpoint');
    _BT_deleteImgOverlayAssets();
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

  function _BT_animationPlayback(arg){
    $(arg).parent().find("svg").removeClass("_BT_featureOn");
    if(arg == "#_BT_playButton"){
        flip = !flip;
        $('#_BT_playPause').attr({
          "from": flip ? pause : play,
          "to": flip ? play : pause
        }).get(0).beginElement();

        if (flip) {
          _BT_injectScript({script:"_BT_BannerObjectPlay", remove: 1});
        } else {
          _BT_injectScript({script:"_BT_BannerObjectPause", remove: 1});
          $(arg).children().children().addClass("_BT_featureOn");
        }
        return;
    }
    (arg == "#_BT_firstFrameButton") ? (_BT_injectScript({script:"_BT_BannerObjectFirstFrame", remove: 1})) : (_BT_injectScript({script:"_BT_BannerObjectLastFrame", remove: 1}));
  }

  function _BT_imgOverlayAsset(){
    $("#_BT_imgAddRefButton").children().removeClass("_BT_featureOn");
    $("#_BT_imgAddRefButton").attr("bt-value", 0);
    if(!imgOverlayFirstRun){
      $("#_BT_imgOverlayUpload").change();
    }
    else{
      $("#_BT_imgOverlayUpload").click();
    }
  }

  function addImgOverlayAsset(arg){
    imgs.push(arg);
    $("#_BT_imgRefGallery").append(getImgContainer({imgSrc: imgs[imgs.length-1], id: imgs.length-1}));

    if(imgs.length-1 < 1){
      $("#_BT_imgDelRefButton, #_BT_imgRefGalleryContainer").addClass("_BT_visible");
      $("#_BT_imgOverlay").attr("src", imgs[imgs.length-1]);
      $("#_BT_imgOverlay").addClass("_BT_visible");
      localStorage['uniqueID_imgOverlay'] = imgs[imgs.length-1];
      $(".imgContainer > .img").addClass("_BT_selectedImgOverlay");
    }
    $("#_BT_imgRefGallery").width(imgs.length * 87 + "px");
  }

  function _BT_deleteImgOverlayAssets(){
    imgs = new Array();
    $("#_BT_imgRefGallery").empty();
    $("#_BT_imgOverlay").attr("src", "");
    $("#_BT_imgOverlay, #_BT_imgDelRefButton, #_BT_imgRefGalleryContainer").removeClass("_BT_visible");
    localStorage.removeItem('uniqueID_imgOverlay');
  }

  function getImgContainer(object){
    var html = '<div class="imgContainer" id=' + object.id + '><img class="img" src="' + object.imgSrc + '" alt=""><span class="delImg">&#x2716</span></div>';
    return html;
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

  function _BT_animationBoost(arg) {
    (arg == 1) ? (_BT_injectScript({ script: "_BT_BannerObjectBoost", remove: 1, arg: "<script>var arg = 2;</script>" })) : (_BT_injectScript({ script: "_BT_BannerObjectBoost", remove: 1, arg: "<script>var arg = 1;</script>"}));

    chrome.storage.sync.set({
      "uniqueID_animationBoost": arg
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
      console.log(request);

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
      } else if (request == "getLastHoveredElement") {
        console.log("im in content script", lastHoveredElement);
        sendResponse({ value: lastHoveredElement });
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
})