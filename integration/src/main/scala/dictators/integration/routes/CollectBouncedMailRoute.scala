/**
 * Copyright 2013 Bayes Technologies
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
package dictators.integration.routes

import org.apache.camel.scala.dsl.builder.RouteBuilder
import org.vertx.scala.core.Vertx
import dictators.integration.processor.BouncedMailProcessor
import dictators.routes.Address._
import org.vertx.java.core.json.JsonObject


/**
 * This route will take the bounced emails and make sure they are in readible json.
 * then pass them to the vertx event bus.
 * 
 * @author Kevin Bayes
 * @since 1.0.0
 */
class CollectBouncedMailRoute(val vertx: Vertx, val json: JsonObject) extends RouteBuilder {
  
  var amazonSQSEndpoint = "aws-sqs://" + SQS_BOUNCED_EMAIL + "?"
  val bounceConfig = json.getObject("aws-ses-bounces")
  val configNames = bounceConfig.getFieldNames()
  val nameIterator = configNames.iterator()
    
  while (nameIterator.hasNext()) {
    val fieldName = nameIterator next()
	amazonSQSEndpoint = amazonSQSEndpoint + fieldName + "=" + bounceConfig.getString(configNames.iterator().next()) + "&";
  }
  
  amazonSQSEndpoint = amazonSQSEndpoint.substring(0, amazonSQSEndpoint.length() - 1)
  
  (amazonSQSEndpoint) routeId "sesbouncedemailroute" process(new BouncedMailProcessor(vertx)) to ("vertx:" + BOUNCED_EMAIL_QUEUE)

}