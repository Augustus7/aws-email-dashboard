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

/**
 * This script will start the server and create a camel context with
 * the relevant routes.
 */
class App extends Verticle {
  
  val camelContext = new DefaultCamelContext()
  
  override def start(): Unit = {
    super.start
    
    vertx.eventBus registerHandler("dictator.integration.echo", { msg: Message[String] =>
      msg reply msg 
    })
    
    //camelContext.addRoutes(new CollectBouncedMailRoute(vertx));
    
    camelContext start
  }
  
  
  override def stop(): Unit = {
    super.stop
    
    camelContext stop
  }
  
  
}
