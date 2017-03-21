/*
  ______      _                 _                _____ _ _      _
 |  ____|    | |               (_)              / ____| (_)    | |
 | |__  __  _| |_ ___ _ __  ___ _  ___  _ __   | |    | |_  ___| | __
 |  __| \ \/ / __/ _ \ '_ \/ __| |/ _ \| '_ \  | |    | | |/ __| |/ /
 | |____ >  <| ||  __/ | | \__ \ | (_) | | | | | |____| | | (__|   <
 |______/_/\_\\__\___|_| |_|___/_|\___/|_| |_|  \_____|_|_|\___|_|\_\
*/
chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.storage.sync.set({
		'uniqueID_disable': 'false'
	});
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			ExpandPanel: "true"
		});
	});
});
/*
  _____                            _
 |  __ \                          | |
 | |__) |___  __ _ _   _  ___  ___| |_ ___
 |  _  // _ \/ _` | | | |/ _ \/ __| __/ __|
 | | \ \  __/ (_| | |_| |  __/\__ \ |_\__ \
 |_|  \_\___|\__, |\__,_|\___||___/\__|___/
                | |
                |_|
*/
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	if (request.cmd == "get_BT_exterior") {
		$.ajax({
			url: chrome.extension.getURL("/assets/html/_BT_exterior.html"),
			dataType: "html",
			success: sendResponse
		});
	} else if (request.cmd == "get_BT_interior") {
		$.ajax({
			url: chrome.extension.getURL("/assets/html/_BT_interior.html"),
			dataType: "html",
			success: sendResponse
		});
	}
})
/*
  _    _       _   _
 | |  | |     | | | |
 | |__| | ___ | |_| | _____ _   _ ___
 |  __  |/ _ \| __| |/ / _ \ | | / __|
 | |  | | (_) | |_|   <  __/ |_| \__ \
 |_|  |_|\___/ \__|_|\_\___|\__, |___/
                             __/ |
                            |___/
*/
chrome.commands.onCommand.addListener(function (command) {
	if (command == "toggle-extension1") {
		chrome.storage.sync.set({
			'uniqueID_disable': 'false'
		});
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				ExpandPanel: "true"
			});
		});
	} else if (command == "toggle-extension2") {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				ExpandPanel: "false"
			});
		});
	}
});
/*
   _____                              _           _
  / ____|                            | |         | |
 | (___   ___ _ __ ___  ___ _ __  ___| |__   ___ | |_
  \___ \ / __| '__/ _ \/ _ \ '_ \/ __| '_ \ / _ \| __|
  ____) | (__| | |  __/  __/ | | \__ \ | | | (_) | |_
 |_____/ \___|_|  \___|\___|_| |_|___/_| |_|\___/ \__|
*/
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.resetZoom == "true") {
			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, function (tabs) {
				chrome.tabs.setZoom(tabs[0].id, 1);
			});
		} else if ((request.executeScreenshot.indexOf("true") >= 0)) {
			var adSize = request.executeScreenshot;
			adSize = adSize.split(';').pop();

			var adWidth = adSize.split('@')[0];
			adSize = adSize.split('@').pop();

			var adHeight = adSize;

			chrome.tabs.captureVisibleTab({
					quality: 100
				},
				function (data) {
					var content = document.createElement("canvas");
					var image = new Image();

					image.onload = function () {
						var canvas = content;
						canvas.width = adWidth;
						canvas.height = adHeight;

						var context = canvas.getContext("2d");
						context.drawImage(image, 0, 0);

						var link = document.createElement('a');
						link.download = "backup";
						link.href = content.toDataURL("image/jpeg");
						link.click();
					};

					image.src = data;
					chrome.tabs.query({
						active: true,
						currentWindow: true
					}, function (tabs) {
						chrome.storage.sync.set({
							'uniqueID_disable': 'false'
						});
						chrome.tabs.sendMessage(tabs[0].id, {
							screenshot: "false"
						});
					});
				});
		}
	}
);