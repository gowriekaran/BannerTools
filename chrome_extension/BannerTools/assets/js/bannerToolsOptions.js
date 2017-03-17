window.onload = function () {
	document.getElementById("Reset").addEventListener("click", Reset);

	function Reset() {
		chrome.storage.sync.clear();
		alert("Refresh your browser");
		window.close();
	}

	document.getElementById("Override").addEventListener("click", Override);

	function Override() {
		chrome.storage.sync.set({
			"uniqueID_easterEgg": "true"
		});
		chrome.storage.sync.set({
			"uniqueID_override": "1"
		});
		alert("Refresh your browser");
		window.close();
	}
}