/**
 * Login controller
 */
class LoginController {
  /**
   * Check login credentials and return user data on success
   * @param request
   * @param response
   */
  static login(request, response) {
    response.send(
      {
        success: true,
        user: {
          id: 1,
          name: 'John Doe',
        },
      },
      {
        'Access-Control-Allow-Origin': request.headers['origin'],
        'Access-Control-Allow-Credentials': 'true',
        'X-Content-Type-Options': 'nosniff',
      }
    )
  }

  /**
   * Options request before login post request
   * @param request
   * @param response
   */
  static loginOptions(request, response) {
    response.send(null, {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': request.headers['origin'],
      'Access-Control-Allow-Method': 'POST',
      'Access-Control-Allow-Credentials': 'true',
      'X-Content-Type-Options': 'nosniff',
    })
  }

}

export default LoginController