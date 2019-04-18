// handles the alarm creation and deletion

// user clicked stop timer button
function userStopTimer() {
	stopTimer();
	timerLoop = false;
}



// listen for storage changes (specifically if users starts timer from popup) 
// if val not changed it will be undefined
chrome.storage.onChanged.addListener(function(changes, area) {
	  console.log("Change in storage area: " + area);

    var changedItems = Object.keys(changes);
	//  console.log(changedItems);
  //  console.log(changes.timerSet);

    // user started timer
    if (changes.timerSet && changes.timerSet.newValue == true) {
	    console.log('can start timer!!!!!!!!!!!!');
	    // create alarm - start with work timer
	    chrome.alarms.create("workTimer", {
	    	'when': changes.target.newValue
	    })

    }

    /*
    for (var item of changedItems) {
	    console.log(item + " has changed:");
	    console.log("Old value: " + changes[item].oldValue);
	    console.log("New value: " + changes[item].newValue);
	  }
		*/
});

// current alarm finishes
chrome.alarms.onAlarm.addListener(function(alarm) {
	console.log("AlARM DONE");
  
  chrome.storage.sync.get(['timerSet'], function(item) {
		console.log(item.timerSet);
		// only start next alarm if timer is still set
  	if (item.timerSet === true) {
			// change alarm to break timer
			if (alarm.name === 'workTimer') {
			  chrome.storage.sync.get(['breakTime'], function(item) {
				  var now = new Date().getTime();
					var target = new Date(now + item.breakTime * 1000).getTime();
				  // create alarm
					chrome.alarms.create("breakTimer", {'when': target});			
					// update the new target and timer type
				  chrome.storage.sync.set({
				  	'target': target,
				  	'timerType': 'Break'
				  });

				  // notify user work timer has finished
					chrome.notifications.create({
					  type: "basic",
					  title: "Work Timer Finished!",
					  message: "Time to take a break.",
					  iconUrl: "icon-v3.png",
					});

			  });
			}

			// change alarm to work timer
			else if (alarm.name === 'breakTimer') {
			  chrome.storage.sync.get(['workTime'], function(item) {
				  var now = new Date().getTime();
					var target = new Date(now + item.workTime * 1000).getTime();
				  // create alarm
					chrome.alarms.create("workTimer", {'when': target});			
					// update the new target and type
				  chrome.storage.sync.set({
				  	'target': target,
    				'timerType': 'Work'
				  });

				  // notify user break timer finished
					chrome.notifications.create({
					  type: "basic",
					  title: "Break Finished!",
					  message: "Time to get back to work.",
					  iconUrl: "icon-v3.png",
					});

			  });
			}

			else {
				alert('alarm name error in background.js!');
			}
  	}
  });


})


