
package integration;

import org.vertx.scala.platform.Verticle
import org.vertx.scala.mods.ScalaBusMod
import scala.concurrent.Promise
import scala.util.{Try, Success, Failure}
import org.vertx.scala.core.eventbus.Message
import org.vertx.java.core.json.JsonObject
import org.apache.camel.impl.DefaultCamelContext
import integration.processor.BouncedMailProcessor
import integration.routes.CollectBouncedMailRoute

/**
 * This script will start the server and create a camel context with
 * the relevant routes.
 */
class App extends Verticle {
  
  val camelContext = new DefaultCamelContext()
  
  override def start(): Unit = {
    super.start
    
    vertx.eventBus registerHandler("camel-stats", { msg: Message[String] =>
      
    })
    
    camelContext.addRoutes(new CollectBouncedMailRoute(vertx));
    
    
    camelContext start
  }
  
  
  override def stop(): Unit = {
    super.stop
    
    camelContext stop
  }
  
  
}
