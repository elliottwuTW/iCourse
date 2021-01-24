module.exports = (err, req, res, next) => {
  console.error(err)
  return res.send({
    status: 'error',
    message: err.response.data.message || err.message || 'Internal Server Error'
  })
}
