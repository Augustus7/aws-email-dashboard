/**
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 
var vertx = require('vertx');
var container = require('vertx/container');
var eb = vertx.eventBus;
var console = require('vertx/console');	

var config = container.config;

container.deployModule("io.vertx~mod-mongo-persistor~2.1.0", config.mongo_config, function(err){
	if(!err){
		//Used for subscription to queue where JSon string of bounced email details will be published
		eb.registerHandler(config.integration_address, handleBouncedEmail);
		eb.registerHandler(config.engine_address, handleWebRequest);
		}
	else console.log(err);
	});

//handles queries from the client event bus	
var handleWebRequest = function(message, replier){	
	var listOfQueries = {
			"listAllBounces" : config.listAllBounces,
			"listGeneralBounces" : config.listGeneralBounces,
			"listNoEmailBounces" : config.listNoEmailBounces,
			"listSuppressedBounces" : config.listSuppressedBounces,
			"listTransientGeneralBounces" : config.listTransientGeneralBounces,
			"listMailboxFullBounces" : config.listMailboxFullBounces,
			"listMessageToolargeBounces" : config.listMessageToolargeBounces,
			"listContentRejectedBounces" : config.listContentRejectedBounces,
			"listAttachmentRejectedBounces" : config.listAttachmentRejectedBounces,
			"listBouncesBetweenDates" : config.listBouncesBetweenDates,
			"listBouncesByRecipients" : config.listBouncesByRecipients,
			"listLastBounce" : config.listLastBounce,
			"dropBounceCollection" : config.dropBounceCollection
		}
	
	console.log(message.Query.type);
	
	buildCriteria(message, listOfQueries)

	eb.send(config.mongo_config.address, listOfQueries[message.Query.type], function(reply){
	//send response back to requester
		replier(reply);
	});	
		
}

//Handles messages from the integration event bus
var handleBouncedEmail = function(message, replier){
	
	config.insertAwsBounces.document = message;	
	
	eb.send(
		config.mongo_config.address, 
		config.insertAwsBounces, 
		function(reply){
			replier(reply);
		});		
}


function buildCriteria(message, listOfQueries){
		var criteriaList = {
			"listBouncesBetweenDates" : {
										"bounce.timestamp" : {
											"$gte" : message.Query.criteria.startDate,
											"$lt" : message.Query.criteria.endDate
											}
										},
			"listBouncesByRecipients" : {
										"bounce.bouncedRecipients" : {
											$elemMatch : {
												"emailAddress" : {
													$in : message.Query.criteria.recipients
													}
												}
											}
										}								
			};
		//Test if the type of query has a constraint 	
		if(criteriaList.hasOwnProperty(message.Query.type)){
			listOfQueries[message.Query.type].matcher = criteriaList[message.Query.type];
			}
	
	}

//utility function used to compare strings
function strcmp(a, b)
{   
    return (a<b?-1:(a>b?1:0));  
}
