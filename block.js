//document.body.innerHTML = '<div id="block">This Page is Blocked! Get back to work, you can do it!</div>';

var div = document.createElement("div");
div.id = 'block';
div.innerHTML = "This Page is Blocked! Get back to work, you can do it!";
document.body.appendChild(div);


//var textnode = document.createTextNode("Water"); 
//document.getElementById('body').appendChild(div);


//document.body.prepend(div);


/*
document.open('text/html');
//document.write('<!DOCTYPE HTML><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>HAI</title></head><body><h1>OMG HAI2U!!!1</h1></body></html>');
document.write('<div id="block">This Page is Blocked! Get back to work, you can do it!</div>');
document.close();

*/