var vertx = require('vertx');
var server = vertx.createHttpServer();
var routeMatcher = new vertx.RouteMatcher();


routeMatcher.post('/api/:version/aws/ses/bounce', function(request) {
	var apiVersion = req.params().get('version');

	request.dataHandler(function(buffer) {
	    console.log('I received ' + buffer.length() + ' bytes');
	 });

	request.response().end('Thank you for the update!');

});

routeMatcher.noMatch(function(request) {
    req.response().end('What are you trying to do?');
});

routeMatcher.get('/test1', function(req){
	req.response.end("test1 returned");
});
	
routeMatcher.get('/test2', function(req){
	req.response.end("test2 returned");
	});	

server.requestHandler(routeMatcher).listen(8080, 'localhost');
