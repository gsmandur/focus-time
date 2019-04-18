//document.body.innerHTML = '<div id="block">This Page is Blocked! Get back to work, you can do it!</div>';


// if page is not already blocked
if (!document.getElementById("block")) {
	var div = document.createElement("div");
	div.id = 'block';
	// div.innerHTML = 
	let blockMessages = [
		"This Page is Blocked! Get back to work, you can do it!",
		"Think about how far you've gotten, dont't give in now!",
		"Fancy meeting you here. Please just wait a little longer!",
		"you: I want to block this site to focus. also you: nvm"
	]
	// display random message to user
	div.innerHTML = blockMessages[Math.floor(Math.random() * Math.floor(blockMessages.length))];
	document.body.appendChild(div);

	var footer = document.createElement("div");
	footer.id = 'footer';
	footer.innerHTML = "Refresh page if still stuck on this screen";
	document.body.appendChild(footer);

}



//var textnode = document.createTextNode("Water"); 
//document.getElementById('body').appendChild(div);


//document.body.prepend(div);


/*
document.open('text/html');
//document.write('<!DOCTYPE HTML><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>HAI</title></head><body><h1>OMG HAI2U!!!1</h1></body></html>');
document.write('<div id="block">This Page is Blocked! Get back to work, you can do it!</div>');
document.close();

*/