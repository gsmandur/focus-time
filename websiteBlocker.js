// User switches tabs
// TODO 
// handle new window, google search of new website (ie url changes)


function unblockSite() {
	chrome.tabs.executeScript(null, {file: 'unblock.js'});
}

function blockSite(tabId) {
	// get tab url
	chrome.tabs.get(tabId, function(tab) {
	  console.log(tab.url);
	  // block the page here
	  var testUrl = "youtube.com";
	  
	  // TODO   
	  // Check if url is on blacklist
	  var isBlackListed = tab.url.includes(testUrl);

	  // execute script does not work with chrome urls (and does not need to)
	  //var isChromeUrl = tab.url.indexOf("chrome://") === 0 ? true : false;
	  
	  if (true) {
			chrome.tabs.executeScript(null, {file: 'block.js'});
			chrome.tabs.insertCSS(null, {file: 'block.css'});
		}

	});
}

//blocks or unblocks the current website
function handleSite(tabId) {
	// check if alarm is set
	chrome.alarms.getAll(function(alarms) {
		// unblock site if no alarm set or on break 
		if (alarms.length === 0 || alarms[0].name === 'breakTimer') {
			unblockSite();
		}	
    else {
			blockSite(tabId);
    }
	});
}


// when tab is updated (opened or refreshed)
chrome.tabs.onUpdated.addListener(function(tabId) {
	handleSite(tabId);
	//chrome.tabs.executeScript(null, {file: 'unblock.js'});

});

// when user switches tabs
chrome.tabs.onActivated.addListener(function(activeInfo) {
	handleSite(activeInfo.tabId);
});



/*
// current alarm finishes
chrome.alarms.onAlarm.addListener(function(alarm) {
		// worktimer finishes, refresh page to remove block
		chrome.tabs.getCurrent(function(tab) {
			chrome.tabs.reload();
	  });

		//window.location.reload(true); 
		if (alarm.name === 'workTimer') {

			//window.location.reload(false); 
		}
		// break finishes, apply block
		else {
			//blockSit
		}

});
*/

// need to store blocked website urls - use a set? that we save in chrome.storage