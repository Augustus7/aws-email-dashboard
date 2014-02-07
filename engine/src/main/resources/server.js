var vertx = require('vertx');
var server = vertx.createHttpServer();
var routeMatcher = new vertx.RouteMatcher();
var container = require('vertx/container');
var eb = vertx.eventBus;
var console = require('vertx/console');	

var config = {
    "address": "test.my_persistor",
    "host": "localhost",
    "port": 27017,
    "pool_size": 3,
    "db_name": "vertx"
}

var findZipsAL = {
	"action" : "find",
	"collection" : "zips",
	"matcher" : {
			"state" : "AL"
	},
	"limit" : 3
}

var listbounces = {
	"action" : "find",
	"collection" : "bounced_emails",
	"matcher" : {}
}

var testJson = {
				"date" : "2014-01-30",
				"to" : "samora@enetelct.co.za",
				"from" : "kebayes@entelect.co.za"	
}
var testJson2 = {
				"date" : "2015-01-30",
				"to" : "samora@enetelct.co.za",
				"from" : "kebayes@entelect.co.za"	
}



container.deployModule("io.vertx~mod-mongo-persistor~2.0.0-final", config, function(err){
	if(!err){
		console.log("deployed");
		//Used for subscription to queue where JSon string of bounced email details will be published
		eb.registerHandler('camel.queue', handleBouncedEmail);
		//test the subscription on this address
		eb.publish('camel.queue', testJson);
		eb.publish('camel.queue', testJson2);
		}
	else console.log(err);
	});

routeMatcher.post('/api/:version/aws/ses/bounce', function(request) {
	var apiVersion = req.params().get('version');

	request.dataHandler(function(buffer) {
	    console.log('I received ' + buffer.length() + ' bytes');
	 });

	request.response().end('Thank you for the update!');

});

routeMatcher.noMatch(function(req) {
    req.response.end('What are you trying to do?');
});

routeMatcher.get('/list/all', function(req){
	eb.send("test.my_persistor", findZipsAL, function(reply){
			req.response.end(JSON.stringify(reply, null, "\t"));
		});
	
});
	
routeMatcher.get('/list/bounces', function(req){
		eb.send("test.my_persistor", listbounces, function(reply){
			req.response.end(JSON.stringify(reply, null, "\t"));
		});
	});



var handleBouncedEmail = function(message){
	console.log("method called");
	var body = eval(message);
	var SaveQuery = {
		"action" : "save",
		"collection" : "bounced_emails",
		"document" : {
				"date" : body.date,
				"to" : body.to,
				"from" : body.from
			}
		} 	
	eb.send(
		"test.my_persistor", 
		SaveQuery, 
		function(reply){
			console.log(JSON.stringify(reply, null, "\t"));
		});
	}
		
server.requestHandler(routeMatcher).listen(8080, 'localhost');




