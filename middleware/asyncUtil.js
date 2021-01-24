/**
 * Catch the error when calling the controller
 * @param {*} callback : controller method (i.e. request handler)
 */
module.exports = (callback) => (req, res, next) => {
  return Promise.resolve(callback(req, res, next)).catch(next)
}
