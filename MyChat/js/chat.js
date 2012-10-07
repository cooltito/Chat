
var socket;

$(document).ready(function(){
	var url = window.location.href.split("/home")[0];
	
	socket = io.connect(url);
	
	socket.on("welcome", function(data){
		$("#messageDiv").html("<b>" + data.username + "</b> has joined the chat");
	});
		
	socket.on("broadcast", function(data){
		var chatDiv = $("#groupChat");
		$(chatDiv).append("<div><span class='nickSpan' onclick='personalMessage(\""+data.from+"\")' style='color:"+data.color+"'>"+data.from+"</span> : "+data.message+"</div>");
		chatDiv[0].scrollTop = chatDiv[0].scrollHeight;
	});
	
	socket.on("error", function(msg){
		$("#messageDiv").html(msg);
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
	
	socket.on("personalMsg", function(data){
		var nick;
		if(data.to){
			nick = data.to;
			showPersonalMessage(nick);
		} else {
			nick = data.from
			showPersonalMessage(nick);
		}
		if(data.message)
			$("#from" + nick).append("<div><span class='nickSpan'>"+data.from+"</span> : "+data.message+"</div>")
	});
	
	$("#submitNick").bind("click", function(){
		var nick = $("#nick").val();
		var color = $("#color").val();
		socket.emit("register", {nick : nick, color : color});
	});
	
	$("#submitMessage").bind("click", function(){
		submitMessage(socket);
	});
	
	$("#messageInput").bind("keypress", function(ev){
		var keyCode = ev.keyCode;
		if(keyCode == 13){
			submitMessage(socket);
		}
	});
});

var submitMessage = function(){
	var msg = $("#messageInput").val();
	socket.emit("message", msg);
	var msg = $("#messageInput").val("");
};

var personalMessage = function(toNick){
	socket.emit("personalMessage", {to : toNick, message : null});
};

var showPersonalMessage = function(toNick){
	if(document.getElementById("chatWith" + toNick) == null){
		createPersonalMessageDialog(toNick, getChatDisplayContent(toNick));
	} else {
		$("#chatWith" + toNick).dialog("open");
	}
};

var createPersonalMessageDialog = function(toNick, targetDiv){
	$(targetDiv).dialog({
		title : "Chat with " + toNick,
		stack : true,
		buttons : {
			"Send" : function(){
				var msg = $("#to"+toNick).val();
				socket.emit("personalMessage", {to : toNick, message : msg});
				$("#to"+toNick).val("");
			}
		}
	});
};

var getChatDisplayContent = function(toNick){
	var personalChatDiv = $("<div id='chatWith" + toNick + "' class='personalChatDiv'></div>");
	personalChatDiv.append("<div id='from" + toNick + "' class='personalChatDisplay'></div>");
	personalChatDiv.append("<div  class='personalChatInput'><input id='to" + toNick + "' type='text'/></div>");
	return personalChatDiv;
};