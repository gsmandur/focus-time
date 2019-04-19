// script blocks the current website

// if page is not already blocked
if (!document.getElementById("block")) {
	var div = document.createElement("div");
	div.id = 'block';
	// div.innerHTML = 
	let blockMessages = [
		"This Page is Blocked! Get back to work, you can do it!",
		"Think about how far you've gotten, don't give in now!",
		"Fancy meeting you here. Please just wait a little longer!",
		"you: I want to block this site to focus. also you: nvm"
	]
	// display random message to user
	div.innerHTML = blockMessages[Math.floor(Math.random() * Math.floor(blockMessages.length))];
	document.body.appendChild(div);

	/*
	var footer = document.createElement("div");
	footer.id = 'footer';
	footer.innerHTML = "Refresh page if still stuck on this screen";
	document.body.appendChild(footer);
	*/
}
