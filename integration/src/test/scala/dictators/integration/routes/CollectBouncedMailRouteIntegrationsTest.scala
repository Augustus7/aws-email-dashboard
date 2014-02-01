package dictators.integration.routes

import org.apache.camel.scala.dsl.builder.RouteBuilderSupport
import org.apache.camel.test.junit4.CamelTestSupport
import org.junit.Test
import dictators.routes.Address._
import org.apache.camel.component.mock.MockEndpoint
import org.apache.camel.scala.dsl.builder.RouteBuilder
import dictators.integration.processor.BouncedMailProcessor
import org.vertx.scala.core.json.Json
import com.amazonaws.auth.AWSCredentials
import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.services.sqs.AmazonSQSClient
import com.amazonaws.services.sqs.AmazonSQS
import com.amazonaws.services.sqs.model.CreateQueueRequest
import com.amazonaws.regions.Region
import com.amazonaws.regions.Regions
import org.apache.camel.impl.JndiRegistry

class CollectBouncedMailRouteIntegrationsTest extends CamelTestSupport with RouteBuilderSupport {
  
  
  val amazonSQSEndpoint = "aws-sqs://" + SQS_BOUNCED_EMAIL + "?amazonSQSClient=#awsClient"

  override protected def createRegistry(): JndiRegistry = {
     val registry = new JndiRegistry(createJndiContext());
     
     val awsCredentials: AWSCredentials = new BasicAWSCredentials("AKIAIWWOPUXEQ6ZPVACA", "CA0jtxso4ul17z5I8g/lD0GEgClr/q1njh3ciD+d");
     val client: AmazonSQS = new AmazonSQSClient(awsCredentials);
     client.setRegion(Region.getRegion(Regions.US_WEST_2))
     
     registry.bind("awsClient", client)
     
     registry
  }
 
  
  override def createRouteBuilder() = new RouteBuilder {
    amazonSQSEndpoint process(new BouncedMailProcessor(null)) to("mock:exit")
  }
  
  
  @Test
  def testCollectBouncedMailRoute(): Unit = {
    
    getMockEndpoint("mock:exit") expectedMessageCount 1
     
    template sendBody(amazonSQSEndpoint, Json.obj("notificationType" -> "Bounce"))
    
    assertMockEndpointsSatisfied
    
  }

}