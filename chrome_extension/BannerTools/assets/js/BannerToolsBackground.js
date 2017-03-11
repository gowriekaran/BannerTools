chrome.commands.onCommand.addListener(function(command) {
	if(command == "toggle-feature"){
	    chrome.storage.sync.set({'uniqueID_disable': 'false'});
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  chrome.tabs.sendMessage(tabs[0].id, {ExpandPanel: "true"});
		});
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.sync.set({'uniqueID_disable': 'false'});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {ExpandPanel: "true"});
	});
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.resetZoom == "true"){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			  chrome.tabs.setZoom(tabs[0].id, 1);
			});
		}
		else if ((request.executeScreenshot.indexOf("true") >= 0)){
			var adSize = request.executeScreenshot;
			adSize =  adSize.split(';').pop();

			var adWidth = adSize.split('@')[0];
			adSize = adSize.split('@').pop();

			var adHeight = adSize;

			chrome.tabs.captureVisibleTab({
				quality: 100
			},
			function(data) {
				var content = document.createElement("canvas");
				var image = new Image();

				image.onload = function() {
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
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.storage.sync.set({'uniqueID_disable': 'false'});
					chrome.tabs.sendMessage(tabs[0].id, {screenshot: "false"});
				});
			});
		}
	}
);