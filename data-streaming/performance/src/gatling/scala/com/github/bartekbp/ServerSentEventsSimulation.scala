package com.github.bartekbp

import io.gatling.core.Predef.{Simulation, atOnceUsers}

class ServerSentEventsSimulation extends Simulation {
  val simulationName = "ServerSentEventsSimulation"
  val path = "/dataSse"

  setUp(
    BaseSimulation.simulation(simulationName, path).inject(atOnceUsers(1))
  ).protocols(BaseSimulation.httpConf(path))
}
