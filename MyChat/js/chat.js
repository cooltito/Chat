$(document).ready(function(){
	var socket = io.connect("http://ec2-54-245-32-226.us-west-2.compute.amazonaws.com");
	
	socket.on("welcome", function(data){
		$("#messageDiv").html(data.username + " has joined the chat");
	});
		
	socket.on("broadcast", function(data){
		$("#groupChat").append("<div>"+data.from+" : "+data.message+"</div>");	
	});
	
	$("#submitNick").bind("click", function(){
		var nick = $("#nick").val();
		socket.emit("register", nick);
		$("#nickDiv").fadeOut();
		$("#groupChat").fadeIn();
		$("#messageEnter").fadeIn();		
	});
	
	$("#submitMessage").bind("click", function(){
		var msg = $("#messageInput").val();
		socket.emit("message", msg);		
	});
});
