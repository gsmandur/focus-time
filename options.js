
function blackListSite(url) {
  if (url === '') return;


  // get the blacklist from storage
  chrome.storage.local.get({
    blackList: [] // set if not defined
  }, function(item) {

    // add url to BL
    let arr = item.blackList; 
    if (!arr.includes(url)) { // make sure url is not already there
      arr.push(url);
      console.log(arr);
    }
    
    // update storage
    chrome.storage.local.set({
      blackList: arr  
    });

  });


}

let urlTextArea = document.getElementById("url");


// users presses enter on text box
urlTextArea.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    url = urlTextArea.value;
    console.log(url);
    urlTextArea.value = '';

    // add to blacklisted websites
    if (url !== '') {
      blackListSite(url);


    }
    return false;
  }
});





// Saves options to chrome.storage
function save_options() {
  var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
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
  chrome.storage.sync.get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);

