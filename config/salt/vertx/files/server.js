var vertx = require('vertx');
var container = require('vertx/container');
var console = require('vertx/console');
var config = container.config;

console.log('Starting Amazon Webservice Admin Module');

var modules = config.modules;

for(var i = 0; i < modules.length; i++) {
	console.log('Deploying module [' + modules[i].name + ']')

	var instances = 1;
	if(modules[i].instances) {
		instance = modules[i].instances;
	}

	container.deployModule(modules[i].name, modules[i].config, instances, function(err, deployId){
	  if (!err) {
	    console.log("The verticle has been deployed, deployment ID is " + deployId);
	  } else {
	    console.log("Deployment failed! " + err.getMessage());
	  }
	});
}

