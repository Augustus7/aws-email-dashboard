
var vertx = require('vertx');
var container = require('vertx/container');
var console = require('vertx/console');

var eb = vertx.eventBus;
var server = vertx.createHttpServer();
var routeMatcher = new vertx.RouteMatcher();
var config = container.config()


routeMatcher.get('/', function(req) {
	req.response.sendFile('web/dist/index.html', 'web/dist/404.html'); 
});

server.listen(8080, "localhost", function(err) {

	if(!err) {
		console.log("Listening on port")
	}

});