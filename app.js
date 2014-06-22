
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , request = require('request')
  , qs = require('querystring')
  , url = require('url')
  , querystring = require('querystring');

var app = express();

process.on("uncaughtException", function(err){
	console.log("Caught exception " + err);
});

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(request, response){
	fs.readFile("./landing-page/pages/index.html", function(err, page){
		response.writeHead(200, {'Content-type' : 'text/html'});
		response.write(page);
		response.end();
	});
});

app.get('/start', function(request, response){
	console.log("ROUTE /start : Starting a chat session");
	http.get("http://localhost:8080/start", function(res){
		var myData = "";
		res.on('data', function(data){
			console.log("Data now is " + data);
			myData = myData + data;
		});
		res.on('end', function(){
			console.log("Received Chat " + myData);
			response.writeHead(200, {'Content-type' : 'text/plain'});
			response.write(myData);
			response.end();
		});
		res.on('error', function(err){
			console.log(err);
			response.writeHead(500,{'Content-type' : 'text/plain'});
			response.write("Sorry - there's something wrong here! We have taken due note of the problem and it shall be fixed! Please check back again in some time.");
			response.end();
		});
	});
});

app.post('/chat', function(request, response){
	
	console.log("Received chat request");
	var myData = "";
	request.on('data', function(data){
		myData = myData + data;
	});
	request.on('end', function(){
		console.log("Chat received is " + myData);
		myData = JSON.parse(myData);
		var params = JSON.stringify({
			'sessionID' : myData.sessionID,
			'utterance' : myData.utterance
		});
		var options = {
				'host' : 'localhost',
				'port' : 8080,
				'path' : '/chat',
				'method' : 'POST'
				
		};
		myData.utterance = myData.utterance.replace("!", "").replace(":", "");
		var requestObject = http.request(options, function(res){
			var myData = "";
			res.on('data', function(data){
				console.log("Data now is " + data);
				myData = myData + data;
			});
			res.on('end', function(){
				console.log("Received Chat " + myData);
				response.writeHead(200, {'Content-type' : 'text/plain'});
				response.write(myData);
				response.end();
			});
			res.on('error', function(err){
				console.log(err);
				response.writeHead(500,{'Content-type' : 'text/plain'});
				response.write("Sorry - there's something wrong here! We have taken due note of the problem and it shall be fixed! Please check back again in some time.");
				response.end();
			});
		});
		console.log(params);
		requestObject.write(params);
		requestObject.end();
		
	});
		
});

app.get('/landing-page/pages/:file', function(request, response){
	
	fs.readFile("./landing-page/pages/" + request.params.file, function(err, page){
		response.writeHead(200, {'Content-type' : 'application/javascript'});
		response.write(page);
		response.end();
	});
	
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
