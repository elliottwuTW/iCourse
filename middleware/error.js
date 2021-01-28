module.exports = (err, req, res, next) => {
  console.error(err)
  return res.render('error', {
    status: err.response.status,
    message: ((err.response) ? err.response.data.message : null) || err.message || 'Internal Server Error'
  })
}
