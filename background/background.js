// handles the alarm creation and deletion

// listen for storage changes (specifically if users starts timer from popup)
chrome.storage.onChanged.addListener(function(changes, area) {
  // if a value is not not changed it will be undefined
  var changedItems = Object.keys(changes);

  // user started timer
  if (changes.timerSet && changes.timerSet.newValue === true) {
    // create alarm - start with work timer
    chrome.alarms.create("workTimer", {
      when: changes.target.newValue
    });
  }
});

// current alarm finishes -> change alarm and create desktop notification
chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log("AlARM DONE");

  chrome.storage.sync.get(["timerSet"], function(item) {
    // only start next alarm if timer is still set
    if (item.timerSet === true) {
      // change alarm to break timer
      if (alarm.name === "workTimer") {
        chrome.storage.sync.get(["breakTime"], function(item) {
          var now = new Date().getTime();
          var target = new Date(now + item.breakTime * 1000 * 60).getTime();
          // create alarm
          chrome.alarms.create("breakTimer", { when: target });
          // update the new target and timer type
          chrome.storage.sync.set({
            target: target,
            timerType: "Break"
          });

          // notify user work timer has finished
          chrome.notifications.create({
            type: "basic",
            title: "Work Timer Finished!",
            message: "Time to take a break.",
            iconUrl: "icon/icon-v3.png"
          });
        });
      }

      // change alarm to work timer
      else if (alarm.name === "breakTimer") {
        chrome.storage.sync.get(["workTime"], function(item) {
          var now = new Date().getTime();
          var target = new Date(now + item.workTime * 1000 * 60).getTime();
          // create alarm
          chrome.alarms.create("workTimer", { when: target });
          // update the new target and type
          chrome.storage.sync.set({
            target: target,
            timerType: "Work"
          });

          // notify user break timer finished
          chrome.notifications.create({
            type: "basic",
            title: "Break Finished!",
            message: "Time to get back to work.",
            iconUrl: "icon/icon-v3.png"
          });
        });
      }
    }
  });
});
