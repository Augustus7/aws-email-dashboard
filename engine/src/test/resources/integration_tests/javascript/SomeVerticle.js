var vertx = require("vertx");
var console = require('vertx/console')
var vertxTests = require("vertx_tests");
var vassert = require("vertx_assert");

console.log("attempting to assert");
vassert.assertEquals("pong!", "pong!");
console.log("assert complete");
vassert.testComplete();

