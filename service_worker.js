(async () => {
const SS = chrome.storage.session;
const activeIds = Object.keys(await SS.get(null)).map((id) => {return Number(id)});
console.log("Loaded: " + activeIds.toString());

// check lastFocusedPage on startup
{
	const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
	if (tab != undefined && activeIds.indexOf(tab.id) != -1) {
		run(tab.id)
	}
}

function save(id, operation) { // save data on change
	if (operation == "s") {
		SS.set({[id]: null});
		console.log("Saved: " + id)
	} else if (operation == "r") {
		SS.remove(id.toString());
		console.log("Removed: " + id);
	}
}

function run(id) {
	chrome.scripting.executeScript({
		target: { tabId: id },
		files: ['main.js']
	});
}

chrome.action.onClicked.addListener((tab) => {
	const i = activeIds.indexOf(tab.id)
	if (i == -1) {
		activeIds.push(tab.id);
		run(tab.id);
		save(tab.id, "s");
	} else {
		activeIds.splice(i, 1);
		save(tab.id, "r");
	}
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
	const i = activeIds.indexOf(tabId)
	if (i != -1) {
		activeIds.splice(i, 1);
		save(tabId, "r")
	}
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (activeIds.indexOf(tabId) != -1 && changeInfo.url) {
		run(tabId);
	}
});

})();