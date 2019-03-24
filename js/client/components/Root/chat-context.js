class ChatContext {
  messages = []
  user = null

  static clone(ctx) {
    const newCtx = new ChatContext()
    newCtx.messages = ctx.messages.concat([])
    if (ctx.user) {
      newCtx.user = {...ctx.user}
    }
    return newCtx
  }
}
export default ChatContext