// Handle the blocking/unblocking of websites based on the blacklist 

function unblockSite() {
	chrome.tabs.executeScript(null, {file: 'background/unblock.js'});
}


function blockSite(tabId) {
	// get tab url
	chrome.tabs.get(tabId, function(tab) {
	  console.log(tab.url);

		// check if url is blacklisted
	  chrome.storage.sync.get(['blackList'], function(item) {
	    for (let i = 0; i < item.blackList.length; i++) {

	    	// if url is substring of blacklisted site block site
	     	if (tab.url.includes(item.blackList[i])) {
					chrome.tabs.executeScript(null, {file: 'background/block.js'});
					chrome.tabs.insertCSS(null, {file: 'background/block.css'});  
					break;   	
				}
	    }
  	});
	
	});
}

//blocks or unblocks the current website
function handleSite(tabId) {
	// get tab url
	chrome.tabs.get(tabId, function(tab) {
	  var isChromeUrl = tab.url.indexOf("chrome://") === 0 ? true : false;
	  var isChromeExtUrl = tab.url.indexOf("chrome-extension://") === 0 ? true : false;

	  // execute script does not work with chrome urls (and does not need to)
		if (!isChromeUrl && !isChromeExtUrl) {	
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

	});
}

// Listen for tab changes: 

// when tab is updated (opened or refreshed)
chrome.tabs.onUpdated.addListener(function(tabId) {
	handleSite(tabId);
});

// user switches tabs
chrome.tabs.onActivated.addListener(function(activeInfo) {
	handleSite(activeInfo.tabId);
});

// user switches windows
chrome.windows.onFocusChanged.addListener(function(windowId) {
  chrome.tabs.query({currentWindow: true, active: true },function (tabArray) { 
  	if (typeof tabArray[0] !== 'undefined') {
  		handleSite(tabArray[0].id);
  	}
  });    	
});



// listen for storage changes for when a new alarm is set
chrome.storage.onChanged.addListener(function(changes, area) {
  // timer type changed (if val not changed it will be undefined)
  if (changes.timerType) {

  	// block or unblock current tab
	  chrome.tabs.query({ currentWindow: true, active: true },function (tabArray) { 
			if (typeof tabArray[0] !== 'undefined') {  // current tab is a chrome tab
				handleSite(tabArray[0].id);
			}
	  });    	
  }
});
