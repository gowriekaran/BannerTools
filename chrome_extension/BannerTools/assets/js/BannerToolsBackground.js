// var isEnabled = false;
// var isforceRun = false;

// chrome.storage.sync.get("uniqueID_forceRun", function (data) {
// 	if (data["uniqueID_forceRun"] == 1) {
// 		isforceRun = true;
// 		console.log("isforceRun", isforceRun);
// 	}
// 	chrome.storage.sync.get("uniqueID_disable", function (data) {
// 		if (data["uniqueID_disable"] == 0) {
// 			isEnabled = true;
// 			console.log("isEnabled", isEnabled);
// 		}
// 		if ((isEnabled) || (isforceRun)) {
			console.log("Creating context item");

			var contextMenuItem = {
				"id": "iFrameItem",
				"title": "Open with BT",
				"contexts": ["all"],
				"onclick": callBack
			};

			var lastHoveredElement;

			chrome.contextMenus.create(contextMenuItem);
			// chrome.contextMenus.onClicked.addListener(function (e) {
			// 	console.log(this);
			// 	console.log("im in background script");

			// 	// chrome.tabs.sendMessage(tab.id, "getLastHoveredElement", function (data) {
			// 	// 	lastHoveredElement = data.value;
			// 	// });

			// });
			function callBack(info, tab) {
				console.log("im in background script again");

				chrome.tabs.sendMessage(tab.id, "getLastHoveredElement", function (data) {
					console.log(data);
					lastHoveredElement = data;
					console.log(lastHoveredElement);
				});

			}
// 		}
// 	});
// });


// searchUrbanDict = function (word) {
// 	var query = word.selectionText;
// 	chrome.tabs.create({ url: "http://www.urbandictionary.com/define.php?term=" + query });
// };

// chrome.contextMenus.create({
// 	title: "Search in UrbanDictionary",
// 	contexts: ["selection"],
// 	onclick: searchUrbanDict
// });

chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			_BT_pluginClick: 1
		});
	});
});

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	if (request.cmd == "get_BT_") {
		$.ajax({
			url: chrome.extension.getURL("/assets/html/_BT_.html"),
			dataType: "html",
			success: sendResponse
		});
	} else if (request.cmd == "get_AdGear_") {
		$.ajax({
			url: chrome.extension.getURL("/assets/html/AdGear.html"),
			dataType: "html",
			success: sendResponse
		});
	} else if (request.cmd == "screenshot") {
		chrome.tabs.captureVisibleTab({
			quality: 100
		},
			function (data) {
				var content = document.createElement("canvas");
				var image = new Image();

				image.onload = function () {
					var canvas = content;
					canvas.width = request.specs[0];
					canvas.height = request.specs[1];

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
						'uniqueID_disable': 0
					});
					chrome.tabs.sendMessage(tabs[0].id, {
						screenshot: 0
					});
				});
			});
	} else if (request.cmd == "resetZoom") {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function (tabs) {
			chrome.tabs.setZoom(tabs[0].id, 1);
		});
	}
})