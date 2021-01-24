module.exports = (err, req, res, next) => {
  // console.error(err)
  return res.send({
    status: 'error',
    message: ((err.response) ? err.response.data.message : null) || err.message || 'Internal Server Error'
  })
}
