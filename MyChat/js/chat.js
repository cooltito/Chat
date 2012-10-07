$(document).ready(function(){
	var url = window.location.href.split("/home")[0];
	
	var socket = io.connect(url);
	
	socket.on("welcome", function(data){
		$("#messageDiv").html("<b>" + data.username + "</b> has joined the chat");
	});
		
	socket.on("broadcast", function(data){
		$("#groupChat").append("<div>"+data.from+" : "+data.message+"</div>");	
	});
	
	socket.on("duplicate", function(){
		$("#messageDiv").html("Nickname already in use. Please choose another nick.");
	});
	
	socket.on("leave", function(data){
		$("#messageDiv").html("<b>" + data.username + "</b> has left the chat");
	});
	
	socket.on("successEntry", function(){
		$("#nickDiv").fadeOut(1000, function(){
			$("#groupChat").fadeIn();
			$("#messageEnter").fadeIn();
		});	
	});
	
	$("#submitNick").bind("click", function(){
		var nick = $("#nick").val();
		socket.emit("register", nick);
	});
	
	$("#submitMessage").bind("click", function(){
		var msg = $("#messageInput").val();
		socket.emit("message", msg);		
	});
});
