import http from 'http'


class ApiServer {

  router
  config
  server

  constructor(config, router) {
    this.config = {...config}
    this.router = router
  }

  run() {
    const cfg = this.config
    const host = cfg.host || '0.0.0.0'
    const port = cfg.port || 1234

    this.server = http.createServer()
    this.server.listen(
      port,
      host,
      () => {
        console.log(`API server is listening ${host}:${port}`)
      }
    )

    this.server.on('request', (request, response) => {
      this.router.execute(request, response)
    })
  }
}

export default ApiServer