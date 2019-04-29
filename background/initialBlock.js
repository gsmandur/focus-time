// add inital websites to blacklist when extension first installed


// function almost same as one from options.js
// add url to blacklist
// callback is optional, used to add multiple sites at once in sync
function blackListSite(url, callback) {
  if (url === '') return;

  // get the blacklist from storage
  chrome.storage.sync.get({
    blackList: [] // set if not defined
  }, function(item) {

    let arr = item.blackList; 
    // add url to BL (only if not already there)    
    if (!arr.includes(url)) { 
      arr.push(url);
      console.log(arr);

      // update storage
      chrome.storage.sync.set({
        blackList: arr  
      }, function() {
        if(callback) callback();
      });
    }
    
  });

}

// add a few initial blacklisted sites to give the
// user an idea of how it works
function first_start() {
  // add sites 1 by 1 in sync
  blackListSite("facebook.com", function() {
    blackListSite("youtube.com", function() {
      blackListSite("instagram.com");
    });
  });
}

// run on first time install
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        first_start();
    }
});