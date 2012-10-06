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

server.listen(80);

app.get('/home', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var users = {};

io.sockets.on('connection', function (socket) {

  var user = "";
  socket.on('message', function (message) {
    console.log("Message received : " + message + " from " + user);
    io.sockets.emit('broadcast', {from : user, message : message});
  });

  socket.on('register', function (username) {
    users[username] = socket.id;
    user = username;
    io.sockets.emit('welcome', {username : username});
    console.log("User " + username + " joined");
  });

  socket.on('disconnect', function () {
    delete users[user];
  });
});
 
