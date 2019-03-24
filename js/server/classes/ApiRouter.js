import url from 'url'
import isPlainObject from 'lodash-es/isPlainObject'
import isFunction from 'lodash-es/isFunction'
import isArray from 'lodash-es/isArray'

/**
 * Simple router for API calls
 */
class ApiRouter {

  routes = []
  container

  constructor(container) {
    this.container = container
  }

  /**
   * Execute incoming request
   * @param request
   * @param response
   */
  execute(request, response) {
    const method = request.method
    const urlParsed = url.parse(request.url)
    const query = urlParsed.query
    let body = ''

    console.log(`Lookup route for ${method} ${request.url}`)

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
          request.body = body
        }
      }

      const route = this.routes.find(routeItem => {
        return routeItem.pattern === urlPattern
      })

      if (!route) {
        console.log(`Not found`)
        this.handle404(request, response)
      } else {
        this.handleRoute(route.callback, request, response)
      }
    })
  }

  /**
   * Send error 404 response
   * @param request
   * @param response
   */
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

  /**
   * Handle existing route
   * @param callback
   * @param request
   * @param response
   */
  handleRoute(callback, request, response) {
    const responseCtx = {
      send: (data, headers) => {
        if (data !== null) {
          if (!isPlainObject(data)) {
            data = {
              data: data,
            }
          }
          const defaultHeaders = {
            'Content-Type': 'application/json',
          }
          response.writeHead(200, {...defaultHeaders, ...headers})
          response.write(JSON.stringify(data))
        } else {
          response.writeHead(200, {...headers})
          response.write('')
        }
        response.end()
      },
    }
    if (isFunction(callback)) {
      return callback(request, responseCtx)
    } else if (isArray(callback)) {
      const serviceId = callback[0]
      const method = callback[1]
      const service = this.container.get(serviceId)
      const func = service[method]
      console.log(`Execute ${serviceId}:${method}`)
      const result = func.call(service, request, responseCtx)
      if (service._clearRefOnExit) {
        this.container.unset(serviceId)
      }
      return result
    }
  }

  /**
   * Add route for GET request
   * @param url
   * @param callback
   */
  get(url, callback) {
    this.routes.push({
      pattern: `GET:${url}`,
      callback: callback,
    })
  }

  /**
   * Add route for POST request
   * @param url
   * @param callback
   */
  post(url, callback) {
    this.routes.push({
      pattern: `POST:${url}`,
      callback: callback,
    })
  }

  /**
   * Add route for OPTIONS request
   * @param url
   * @param callback
   */
  options(url, callback) {
    this.routes.push({
      pattern: `OPTIONS:${url}`,
      callback: callback,
    })
  }
}

export default ApiRouter