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

		// check if url is blacklisted
	  chrome.storage.sync.get(['blackList'], function(item) {
	    for (let i = 0; i < item.blackList.length; i++) {

	    	// if url is substring of blacklisted site block site
	     	if (tab.url.includes(item.blackList[i])) {
					chrome.tabs.executeScript(null, {file: 'block.js'});
					chrome.tabs.insertCSS(null, {file: 'block.css'});  
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


// when tab is updated (opened or refreshed)
chrome.tabs.onUpdated.addListener(function(tabId) {
	handleSite(tabId);
	//chrome.tabs.executeScript(null, {file: 'unblock.js'});

});

// when user switches tabs
chrome.tabs.onActivated.addListener(function(activeInfo) {
	handleSite(activeInfo.tabId);
});

// whn user switches windows
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
	    console.log(changes.timerType);
    	var type = changes.timerType.newValue;

    	// block or unblock current tab
		  chrome.tabs.query({ currentWindow: true, active: true },function (tabArray) { 
  			if (typeof tabArray[0] !== 'undefined') {  // current tab is a chrome tab
  				handleSite(tabArray[0].id);
  				/*
					// work timer set,
					if (type === 'work') {
						blockSite(tabArray[0].id);
					}
					// break timer
					else {
						unblockSite(tabArray[0].id);
					}
					*/			
				}
		  });    	
    }
  });

/*
// current alarm finishes
chrome.alarms.onAlarm.addListener(function(alarm) {
		// worktimer finishes, refresh page to remove block
	  chrome.tabs.query({ currentWindow: true, active: true },function (tabArray) { 
	  	//handleSite(tabArray[0].id);			
			//chrome.tabs.reload();

			// work finishes, unblock site
			if (alarm.name === 'workTimer') {
				unblockSite();
			}
			// break finishes, apply block
			else {
				blockSite(tabArray[0].id);
			}			
	  });

	

});
*/
// need to store blocked website urls - use a set? that we save in chrome.storage