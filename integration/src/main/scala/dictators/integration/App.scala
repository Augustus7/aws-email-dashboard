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
package dictators.integration;

import org.vertx.scala.platform.Verticle
import org.vertx.scala.mods.ScalaBusMod
import scala.concurrent.Promise
import scala.util.{Try, Success, Failure}
import org.vertx.scala.core.eventbus.Message
import org.vertx.java.core.json.JsonObject
import org.apache.camel.impl.DefaultCamelContext
import dictators.integration.processor.BouncedMailProcessor
import dictators.integration.routes.CollectBouncedMailRoute
import org.vertx.scala.core.eventbus.MessageData
import com.amazonaws.auth.AWSCredentials
import com.amazonaws.services.sqs.AmazonSQSClient
import org.apache.camel.CamelContext
import org.apache.camel.impl.JndiRegistry
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.services.sqs.AmazonSQS
import com.amazonaws.regions.Region
import com.amazonaws.regions.Regions

/**
 * This script will start the server and create a camel context with
 * the relevant routes.
 */
class App(var camelContext: CamelContext = null) extends Verticle {
  
  override def start(): Unit = {
    super.start
    
    vertx.eventBus registerHandler("dictator.integration.echo", { msg: Message[JsonObject] =>
      msg reply msg.body
    })
    
    container.config.getString("bounceCollectionMethod") match {
	  case "SQS" => initializeCamel()
	}
    
  }
  
  /*
   * Initialize the camel context
   */
  def initializeCamel() = {
    camelContext = new DefaultCamelContext()
    
    var config = container.config.getObject("aws-ses-bounces");
    
    val awsCredentials: AWSCredentials = new BasicAWSCredentials(config.getString("accessKey"), config.getString("secretKey"))
    val client: AmazonSQS = new AmazonSQSClient(awsCredentials)
    client.setRegion(Region.getRegion(Regions.valueOf(config.getString("accessKey"))));
    
    var registry = camelContext.getRegistry().asInstanceOf[JndiRegistry]
    registry.bind("amazonSQSClient", client)
    
    camelContext.addRoutes(new CollectBouncedMailRoute(vertx, container.config))
    
    camelContext start
  }
  
  
  override def stop(): Unit = {
    super.stop
    
    camelContext stop
  }
  
  
}
