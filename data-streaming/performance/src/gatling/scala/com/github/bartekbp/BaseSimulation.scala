package com.github.bartekbp

;

import io.gatling.core.scenario.Simulation
import io.gatling.core.Predef._
import io.gatling.core.structure.ScenarioBuilder
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder

object BaseSimulation {
  def httpConf(path: String): HttpProtocolBuilder =
    http
    .baseURL("http://localhost:8000")
    .warmUp(s"http://localhost:8000${path}?limit=10")

  def simulation(simulationName: String, path: String): ScenarioBuilder =
    scenario(simulationName)
    .exec(_.set("requestLimit", 50000))
    .asLongAs(session => session("requestLimit").as[Int] < 1 * 1000 * 1000) {
      repeat(3) {
        exec(
          http("${requestLimit}")
            .get(path + "?limit=${requestLimit}")
            .check(status.is(200))
        )
          .exitHereIfFailed
          .pause(3)
      }
        .exec(session => session.set("requestLimit", session("requestLimit").as[Int] + 25000))
    }
}
