package com.github.bartekbp

import io.gatling.core.Predef.{Simulation, atOnceUsers}

class HttpStreamingSimulation extends Simulation {
  val simulationName = "HttpStreamingSimulation"
  val path = "/dataObs"

  setUp(
    BaseSimulation.simulation(simulationName, path).inject(atOnceUsers(1))
  ).protocols(BaseSimulation.httpConf(path))
}
