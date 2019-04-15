function displayTimer(target) {
	// display the type of timer (work or break)
  chrome.storage.sync.get(['timerType'], function(item) {
			document.getElementById("timerType").innerHTML = item.timerType;
			document.getElementById("countdown").style.display = "block"; // show it		

  });	

	// start timer
 	timer = setInterval(function(){
 		var now = new Date();
  	var remaining = Math.round((target - now) / 1000);

		//display the countdown  
  	let min = ~~(remaining/60); // round down
  	let sec = remaining % 60;

  	// set the form to "00:00"
  	let minStr = min < 10 ? "0" + min : min;
  	let secStr = sec < 10 ? "0" + sec : sec;
	  document.getElementById("countdown").innerHTML = minStr + " : " + secStr;
	  
	  remaining -= 1;
	  if(remaining < 0){
	  	clearInterval(timer);
			document.getElementById("countdown").innerHTML = "";
			timer = null;

			// get the next target time and display it
		  chrome.storage.sync.get(['target'], function(item) {
	  		console.log(item.target + " old target = " + target);
	  		displayTimer(item.target);
		  });
	  }
	}, 500); // 0.5 second refersh rate 
}

// used to add a start/stop button to the html
function addButton(id, text) {
	var div = document.getElementById('buttons');
  button = document.createElement('button');
  button.id = id;
  button.innerHTML = text;
	if (id === "startButton") { button.addEventListener("click", setUpTimer); }
	else  { button.addEventListener("click", stopTimer); }

  div.appendChild(button);
}

// Saves options to chrome.storage
function save_options(workTime, breakTime, target) {

  chrome.storage.sync.set({
    'workTime': workTime,
    'breakTime': breakTime,
    'target': target,
    'timerType': 'Work',
    'timerSet': true
  });
}

// restore options stored in chrome.storage to the popup on load
function restore_options() {
  chrome.storage.sync.get(['timerSet', 'target'], function(items) { 	// null gives us all keys
		if (items.timerSet) {
			timerSet = true;
		  document.getElementById("countdown").innerHTML = "00 : 00";
			displayTimer(items.target);

			addButton("stopButton", "Stop");
			// hide timer settings
			document.getElementById("timerSettings").style.display = "none";

  	}
  	else {
			addButton("startButton", "Start");
			// show timer settings
			document.getElementById("timerSettings").style.display = "block";
			// hide countdown
			document.getElementById("countdown").style.display = "none"; 		

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

  // remove start and add stop buttons
	document.getElementById("startButton").remove();
	addButton("stopButton", "Stop");
	// hide timer settings
	document.getElementById("timerSettings").style.display = "none";


  save_options(workTime, breakTime, target);
  displayTimer(target);
}

function stopTimer() {
	clearInterval(timer);
	document.getElementById("countdown").style.display = "none"; // block it		
	document.getElementById("countdown").innerHTML = "";
	document.getElementById("timerType").innerHTML = "";

  // remove stop and add start buttons
	document.getElementById("stopButton").remove();
	addButton("startButton", "Start");

	// show timer settings
	document.getElementById("timerSettings").style.display = "block";			

	timer = null;
	timerSet = false;
	chrome.alarms.clearAll();
	//chrome.storage.sync.clear();
	chrome.storage.sync.remove([
		"workTime", 
		"breakTime",
	 	"target", 
	 	"timerType", 
	 	"timerSet"
 	]);
}




var timer = null;
var timerSet = false;
//document.getElementById("startButton").addEventListener("click", setUpTimer);
//document.getElementById("stopButton").addEventListener("click", stopTimer);


// go to options page
document.getElementById("go-to-options").addEventListener("click", function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  }
});

// on page load
document.addEventListener('DOMContentLoaded', restore_options);



