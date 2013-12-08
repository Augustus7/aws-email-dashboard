var vertx = require('vertx');
var server = vertx.createHttpServer();
var routeMatcher = new vertx.RouteMatcher();


routeMatcher.get('/test1', function(req){
	req.response.end("test1 returned");
	});
	
routeMatcher.get('/test2', function(req){
	req.response.end("test2 returned");
	});	

server.requestHandler(routeMatcher).listen(8080, 'localhost');
