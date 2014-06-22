var chatRequest = new XMLHttpRequest();
var sessionID;

chatRequest.onreadystatechange = function(){
	if(chatRequest.readyState == 4 && chatRequest.status == 200){
		var utterance = chatRequest.responseText;
		var displayDiv = document.getElementById("display");
		displayDiv.appendChild(createChatItemDiv("SYSTEM", utterance));
	}
};

var createChatItemDiv = function(speaker, utterance){
	var newChatDiv = document.createElement("div");
	
	/* Fill in speaker details */
	var newSpeakerDiv = document.createElement("div");
	newSpeakerDiv.setAttribute("class", "speaker");
	newSpeakerDiv.setAttribute("name", speaker);
	
	var newSpeakerPara = document.createElement("p");
	newSpeakerPara.setAttribute("class", "speaker");
	newSpeakerPara.setAttribute("name", speaker);
	newSpeakerPara.innerHTML = speaker;
	
	var newUtteranceDiv = document.createElement("div");
	newUtteranceDiv.setAttribute("class", "utterance");
	
	var newUtterancePara = document.createElement("p");
	newUtterancePara.setAttribute("class", "utterance");
	newUtterancePara.innerHTML = utterance;
	
	newChatDiv.appendChild(newSpeakerDiv);
	newChatDiv.appendChild(newSpeakerPara);
	newChatDiv.appendChild(newUtteranceDiv);
	newChatDiv.appendChild(newUtterancePara);
	
	return newChatDiv;
};

var appendDisplay = function(){
	
	var utterance = document.getElementById("user").value;
	var displayDiv = document.getElementById("display");
	
	var params = {
			'utterance' : utterance,
			'sessionID' : sessionID
	};
	
	chatRequest.open("GET", '/chat', true);
	chatRequest.send(params);
	chatRequest.end();
	
	displayDiv.appendChild(createChatItemDiv("USER", utterance));
	document.getElementById("user").value = "";
	
};

var startChatSession = function(){
	console.log("Starting a chat session");
	var startRequest = new XMLHttpRequest();
	
	startRequest.onreadystatechange = function(){
		
		var response = JSON.parse(startRequest.responseText);
		var utterance = response.systemUtterance;
		sessionID = response.sessionID;
		console.log("Starting a new session with session id " + sessionID);
		
	};
	
	startRequest.open("GET", '/start', true);
	startRequest.send();
	
	
};

