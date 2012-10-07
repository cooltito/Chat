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

    socket.get("nickname", function(err, name){
    	socket.get("color", function(err, color){
    	    console.log("Message received : " + message + " from " + name);
    	    io.sockets.emit('broadcast', {from : name, message : message, color : color});
    	});
    });
    
  });

  socket.on('register', function (data) {
	if(users[data.nick]){
		console.log("Duplicate user : "+data.nick);
		socket.emit("error", "Nickname already in use. Please choose another nick.");
	} else {
		socket.set("nickname", data.nick, function(){
			socket.set("color", data.color,function(){
				console.log("User " + data.nick + " joined");
			});
		});
	    users[data.nick] = socket.id;
	    io.sockets.emit('welcome', {username : data.nick});
	    socket.emit("successEntry");
	}
  });
  
  socket.on("personalMessage", function (data) {
  	socket.get("nickname", function (err, name) {
  		if(data.to === name){
  			socket.emit("error", "Can't send personal message to yourself");
  		} else {
  			io.sockets.socket(users[data.to]).emit("personalMsg", {from : name, message : data.message});
  			socket.emit("personalMsg", {to : data.to, from : name, message : data.message});
  		}
  	});
  	
  });

  socket.on('disconnect', function () {
	socket.get("nickname", function(err, name){
		io.sockets.emit("leave", {username : name});
	    delete users[name];
	});
	
  });
});
 
