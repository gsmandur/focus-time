function displayTimer(target) {
	// display the type of timer (work or break)
  chrome.storage.local.get(['timerType'], function(item) {
			document.getElementById("timerType").innerHTML = item.timerType;
  });	

	// display the countdown 
 	timer = setInterval(function(){
 		var now = new Date();
  	var remaining = Math.round((target - now) / 1000);
  	// ~~ turns string to 32bit integer
	  document.getElementById("countdown").innerHTML = remaining + " seconds remaining";
	  
	  remaining -= 1;
	  if(remaining < 0){
	  	clearInterval(timer);
			document.getElementById("countdown").innerHTML = "Finished";
			timer = null;

			// get the next target time and display it
		  chrome.storage.local.get(['target'], function(item) {
	  		console.log(item.target + " old target = " + target);
	  		displayTimer(item.target);
		  });
	  }
	}, 500); // 0.5 second refersh rate 
}


// Saves options to chrome.storage
function save_options(workTime, breakTime, target) {

  chrome.storage.local.set({
    'workTime': workTime,
    'breakTime': breakTime,
    'target': target,
    'timerType': 'work',
    'timerSet': true
  }, function() {
    // Update status to let user know options were saved.
    document.getElementById('countdown').textContent = 'saved!';
  });
}

// restore options stored in chrome.storage to the popup
// specifically the displayed timer
function restore_options() {
  chrome.storage.local.get(['timerSet', 'target'], function(items) { 	// null gives us all keys
		if (items.timerSet) {
			document.getElementById('targetTime').innerHTML = items.target;
			if (items.timerSet === true) {
				timerSet = true;
				displayTimer(items.target);
			}
  	}
  });
}

function setUpTimer() {
	// timer already running
	if (timerSet === true) { return; }
	timerSet = true;

	// get work time and break time in minutes
 	var workTime = document.querySelector('input[name="work"]:checked').value;
 	var breakTime = document.querySelector('input[name="break"]:checked').value;

  var now = new Date().getTime();
  // target timestamp; we will compute the remaining time
  // relative to this date (in seconds)
  var target = new Date(now + workTime * 1000).getTime();

  save_options(workTime, breakTime, target);
  displayTimer(target);
}


function stopTimer() {
	clearInterval(timer);
	document.getElementById("countdown").innerHTML = "Finished";
	document.getElementById("timerType").innerHTML = "";

	timer = null;
	timerSet = false;
	chrome.storage.local.clear();

}

var timer = null;
var timerSet = false;
document.getElementById("startTimer").addEventListener("click", setUpTimer);
document.getElementById("stopTimer").addEventListener("click", stopTimer);
// on page load
document.addEventListener('DOMContentLoaded', restore_options);

