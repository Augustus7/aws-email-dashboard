/**
 *
 */
package dictators.integration

import org.vertx.scala.testtools.TestVerticle
import scala.concurrent.Promise
import scala.concurrent.Future
import org.vertx.scala.core.json._
import org.vertx.scala.core.FunctionConverters._
import scala.util.Try
import scala.util.Success
import scala.util.Failure
import org.junit.Test
import org.vertx.scala.core.eventbus.Message
import org.vertx.testtools.VertxAssert._
import org.vertx.scala.core.AsyncResult
import java.util.concurrent.atomic.AtomicInteger


/**
 * @author kevinbayes
 *
 */
class AppTest extends TestVerticle {
  
	@Test
	def testAppContextLoad(): Unit = {
	  
	   val p = Promise[Unit]
	    container.deployVerticle("scala:dictators.integration.App", Json.obj(), 1, {
	      case Success(deploymentId) => p.success()
	    		  vertx.eventBus.send("dictator.integration.echo", Json.obj("echo" -> "test"), { msg: Message[JsonObject] =>
				      testComplete()
				  })
	      case Failure(ex) => p.failure(ex)
	      	testComplete()
	    }: Try[String] => Unit)
	    
	    p.future
	}

}