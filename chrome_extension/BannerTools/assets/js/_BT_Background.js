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
	if (request.cmd == "_BT_getBT") {
		$.ajax({
			url: chrome.extension.getURL("/assets/html/_BT_.html"),
			dataType: "html",
			success: sendResponse
		});
	} else if (request.cmd == "_BT_screenshot") {
		console.log(request);
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
				// chrome.tabs.query({
				// 	active: true,
				// 	currentWindow: true
				// }, function (tabs) {
				// 	chrome.storage.sync.set({
				// 		'uniqueID_disable': 0
				// 	});
				// 	chrome.tabs.sendMessage(tabs[0].id, {
				// 		_BT_screenshot: 0
				// 	});
				// });
			});
	} else if (request.cmd == "_BT_resetZoom") {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function (tabs) {
			chrome.tabs.setZoom(tabs[0].id, 1);
		});
	}
})