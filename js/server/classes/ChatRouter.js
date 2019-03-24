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

  addCommand(commandType, callback) {
    this.commands.push({
      type: commandType,
      callback: callback,
    })
  }

  processCommand(command) {
    console.log(`Lookup route for command ${command.type}`)
    const route = this.commands.find(item => item.type === command.type)
    if (route) {
      console.log(`Route found for command ${command.type}`)
      const callback = route.callback
      if (isFunction(callback)) {
        console.log('Execute function callback')
        return callback(command)
      } else if (isArray(callback)) {
        console.log('Execute container callback')
        const service = this.container.get(callback[0])
        const func = service[callback[1]]
        return func.call(service, command)
      }
    }
  }
}

export default ChatRouter