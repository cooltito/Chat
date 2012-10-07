$(document).ready(function(){
	var url = window.location.href.split("/home")[0];
	
	var socket = io.connect(url);
	
	socket.on("welcome", function(data){
		$("#messageDiv").html("<b>" + data.username + "</b> has joined the chat");
	});
		
	socket.on("broadcast", function(data){
		var chatDiv = $("#groupChat");
		$(chatDiv).append("<div><span style='font-weight:bold; color:"+data.color+"'>"+data.from+"</span> : "+data.message+"</div>");
		chatDiv[0].scrollTop = chatDiv[0].scrollHeight;
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
		var color = $("#color").val();
		socket.emit("register", {nick : nick, color : color});
	});
	
	$("#submitMessage").bind("click", function(){
		var msg = $("#messageInput").val();
		socket.emit("message", msg);		
	});
});
