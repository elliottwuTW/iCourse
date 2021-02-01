module.exports = (err, req, res, next) => {
  return res.render('error', {
    status: err.response.status,
    message: ((err.response) ? err.response.data.message : null) || err.message || 'Internal Server Error'
  })
}
