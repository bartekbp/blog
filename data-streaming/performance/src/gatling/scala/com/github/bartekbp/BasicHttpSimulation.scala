package com.github.bartekbp

import io.gatling.core.Predef.{Simulation, atOnceUsers}

class BasicHttpSimulation extends Simulation {
  val simulationName = "BasicHttpSimulation"
  val path = "/data"

  setUp(
    BaseSimulation.simulation(simulationName, path).inject(atOnceUsers(1))
  ).protocols(BaseSimulation.httpConf(path))
}
