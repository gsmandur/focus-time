// removes url from the blacklist array
function whiteListSite(url) {
  // get the blacklist from storage
  chrome.storage.local.get({
    blackList: [] // set if not defined
  }, function(item) {

    // remove url from the BL
    let newBL = item.blackList; 
    for (var i=newBL.length-1; i>=0; i--) {
      if (newBL[i] === url) {
        newBL.splice(i, 1);
      }
    }
    console.log(newBL);

    // update storage
    chrome.storage.local.set({
      blackList: newBL  
    });
  
  });
}

// add url of the blacklisted website on the options display
function addSiteToDisplay(url) {

  let list = document.getElementById('blackList');
  let li = document.createElement('li');
  li.innerHTML = url;

  // 'X' for deleting site
  let del = document.createElement('div');
  del.class = "deleteMe";
  del.innerHTML = "X";
  
  li.appendChild(del);
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

function blackListSite(url) {
  if (url === '') return;

  // get the blacklist from storage
  chrome.storage.local.get({
    blackList: [] // set if not defined
  }, function(item) {

    let arr = item.blackList; 
    // add url to BL (only if not already there)    
    if (!arr.includes(url)) { 
      arr.push(url);
      console.log(arr);
      
      // update storage
      chrome.storage.local.set({
        blackList: arr  
      }, function() {
        addSiteToDisplay(url);
      });
    }
    

  });


}



let urlTextArea = document.getElementById("url");

// users presses enter on text box
urlTextArea.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    url = urlTextArea.value;
    console.log(url);
    urlTextArea.value = '';
    blackListSite(url);
    return false;
  }
});





// Saves options to chrome.storage
function save_options() {
  var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  chrome.storage.local.set({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);


//chrome.storage.local.clear();


