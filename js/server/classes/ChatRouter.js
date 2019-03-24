import isFunction from 'lodash-es/isFunction'
import isArray from 'lodash-es/isArray'

/**
 * Routes chat commands to specific router
 */
class ChatRouter {
  commands = []
  container

  constructor(container) {
    this.container = container
  }

  /**
   * Add route for specific chat command
   * @param commandType
   * @param callback
   */
  addCommand(commandType, callback) {
    this.commands.push({
      type: commandType,
      callback: callback,
    })
  }

  /**
   * Process incoming command from client
   * @returns {*}
   * @param request
   */
  processMessage(request) {
    const msgType = request.data.type
    console.log(`Lookup route for command ${msgType}`)
    const route = this.commands.find(item => item.type === msgType)

    if (route) {
      console.log(`Route found for command ${msgType}`)
      const callback = route.callback

      if (isFunction(callback)) {
        callback(request)
      } else if (isArray(callback)) {
        const [serviceId, method] = callback
        const service = this.container.get(serviceId)
        console.log(`Execute ${serviceId}:${method}`)
        service[method].call(service, request)
        if (service._clearRefOnExit) {
          this.container.unset(serviceId)
        }
      }
    }
  }
}

export default ChatRouter