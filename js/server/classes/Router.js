import url from 'url'
import isPlainObject from 'lodash-es/isPlainObject'

class Router {

  routes = []

  execute(request, response) {
    const method = request.method
    const urlParsed = url.parse(request.url)
    const query = urlParsed.query
    let body = ''

    console.log(`Calling ${method} ${request.url}`)

    request.on('data', data => {
      body += data
    })

    request.on('end', () => {
      const urlPattern = `${method}:${urlParsed.pathname}`

      if (method === 'POST' || method === 'PUT') {
        if (query && body) {
          request.query = query
          request.body = body
        } else if (body) {
          // TODO: Rewrite this logic using body-parser
          request.body = body
        }
      }

      const route = this.routes.find(routeItem => {
        return routeItem.pattern === urlPattern
      })

      if (!route) {
        this.handle404(request, response)
      } else {
        this.handleRoute(route.callback, request, response)
      }
    })
  }

  handle404(request, response) {
    response.writeHead(404, {
      'Content-type': 'application/json',
    })
    response.write(JSON.stringify({
      message: 'URL not found!',
      method: request.method,
      url: request.url,
    }))
    response.end()
  }

  handleRoute(callback, request, response) {
    const responseCtx = {
      send: (data) => {
        response.writeHead(200, {
          'Content-type': 'application/json',
        })
        if (!isPlainObject(data)) {
          data = {
            data: data,
          }
        }
        response.write(JSON.stringify(data))
        response.end()
      },
    }
    callback(request, responseCtx)
  }

  get(url, callback) {
    this.routes.push({
      pattern: `GET:${url}`,
      callback: callback,
    })
  }

  post(url, callback) {
    this.routes.push({
      pattern: `POST:${url}`,
      callback: callback,
    })
  }
}

export default Router