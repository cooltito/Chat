/**
 * New node file
 */
 
var express = require('express');
var http = require("http");
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));

server.listen(8080);

app.get('/home', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var users = {};

io.sockets.on('connection', function (socket) {

  socket.on('message', function (message) {
    console.log("Message received : " + message + " from " + user);
    io.sockets.emit('broadcast', {from : user, message : message});
  });

  socket.on('register', function (username) {
	if(users[username]){
		console.log("Duplicate user : "+username);
		socket.emit("duplicate");
	} else {
		socket.set("nickname", username, function(){
			console.log("User " + username + " joined");
		});
	    users[username] = socket.id;
	    io.sockets.emit('welcome', {username : username});
	    socket.emit("successEntry");
	}
  });

  socket.on('disconnect', function () {
	socket.get("nickname", function(err, name){
		io.sockets.emit("leave", {username : name});
	    delete users[name];
	});
	
  });
});
 
