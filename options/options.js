// handle the adding and deleting of elements in the blacklist

// removes url from the blacklist array
function whiteListSite(url) {
  // get the blacklist from storage
  chrome.storage.sync.get({
    blackList: [] // set if not defined
  }, function(item) {

    // remove url from the BL
    let newBL = item.blackList; 
    for (var i = newBL.length-1; i >= 0; i--) {
      if (newBL[i] === url) {
        newBL.splice(i, 1);
      }
    }
    // update storage
    chrome.storage.sync.set({
      blackList: newBL  
    });
  
  });
}

// add url of the blacklisted website on the options display
function addSiteToDisplay(url) {
  let list = document.getElementById('blackList');
  let li = document.createElement('li');

  let text = document.createElement('div');
  text.innerHTML = url;

  // add 'X' for deleting site
  let del = document.createElement('div');
  del.className = "delete";
  del.innerHTML = "X";
  
  li.appendChild(del);
  li.appendChild(text);

  list.appendChild(li);

  // add on click listener so clicking the 'X' deletes removes the site
  del.onclick = function() {
    // remove site from display
    listElement = this.parentNode;
    listElement.parentNode.removeChild(listElement);

    // remove from storage
    whiteListSite(url);
  }
}

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
        addSiteToDisplay(url);

        if(callback) callback();
      });
    }
    
  });

}

let urlTextArea = document.getElementById("url"); 

// users presses enter on text box to add url to blacklist
urlTextArea.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    url = urlTextArea.value;
    console.log(url);
    urlTextArea.value = '';
    blackListSite(url);
    return false;
  }
});


// restore blacklisted sites stored in chrome.storage.
function restore_options() {
  // get the blacklist from storage
  chrome.storage.sync.get({
    blackList: [] // set if not defined
  }, function(item) {
    for (let i = 0; i < item.blackList.length; i++) {
      addSiteToDisplay(item.blackList[i]);
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



document.addEventListener('DOMContentLoaded', restore_options);
chrome.runtime.onInstalled.addListener(first_start);

