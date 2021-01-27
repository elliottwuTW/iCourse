module.exports = (pagination) => {
  const pageArray = Array.from({ length: pagination.pages }).map((v, index) => index + 1)
  return ({
    ...pagination,
    pageArray
  })
}
