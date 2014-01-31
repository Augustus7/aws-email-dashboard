package dictators.integration.routes

import org.apache.camel.scala.dsl.builder.RouteBuilderSupport
import org.apache.camel.test.junit4.CamelTestSupport
import org.junit.Test
import dictators.routes.Address._
import org.apache.camel.component.mock.MockEndpoint
import org.apache.camel.scala.dsl.builder.RouteBuilder
import dictators.integration.processor.BouncedMailProcessor
import org.vertx.scala.core.json.Json

class CollectBouncedMailRouteTest extends CamelTestSupport with RouteBuilderSupport {
  
  override def createRouteBuilder() = new RouteBuilder {
    "direct:entry" process(new BouncedMailProcessor(null)) to("mock:exit")
  }
  
  @Test
  def testCollectBouncedMailRoute(): Unit = {
    
    getMockEndpoint("mock:exit") expectedMessageCount 1
     
    template sendBody("direct:entry", Json.obj("echo" -> "test"))
    
    assertMockEndpointsSatisfied
    
  }

}