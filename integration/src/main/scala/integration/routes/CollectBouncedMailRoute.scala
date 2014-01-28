/**
 *
 */
package integration.routes

import org.apache.camel.scala.dsl.builder.RouteBuilder
import org.vertx.scala.core.Vertx
import integration.processor.BouncedMailProcessor


/**
 * This route will take the bounced emails and 
 * 
 * @author Kevin Bayes
 * @since 1.0.0
 */
class CollectBouncedMailRoute(val vertx: Vertx) extends RouteBuilder {
  
  "aws-sqs://ses-bounced-mails" routeId "sesbouncedemailroute" process(new BouncedMailProcessor(vertx)) to "vertx:wf.bounce.handler"

}