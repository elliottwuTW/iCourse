module.exports = (req) => {
  const originalUrl = req.originalUrl
  const queryString = originalUrl.slice(originalUrl.indexOf('?') + 1)

  const queryArray = []
  // [ 'costRange=5000-10000', 'order=+averageCost' ]
  queryString.split('&').forEach(param => {
    // [ [ 'costRange', '5000-10000' ], [ 'order', '+averageCost' ] ]
    queryArray.push(param.split('='))
  })

  // generate query params
  const queryParam = []
  queryArray.forEach(item => {
    // Common: page
    if (item[0] === 'page') {
      queryParam.push(`page=${item[1]}`)
    }

    // Common: order
    if (item[0] === 'order' && item[1] !== '') {
      queryParam.push(`order=-${item[1]}`)
    }
    // Group: averageCost
    if (item[0] === 'costRange') {
      switch (item[1]) {
        case '-5000':
          queryParam.push('averageCost[lte]=5000')
          break
        case '5001-10000':
          queryParam.push('averageCost[gt]=5000&averageCost[lte]=10000')
          break
        case '10001-15000':
          queryParam.push('averageCost[gt]=10000&averageCost[lte]=15000')
          break
        case '15001-20000':
          queryParam.push('averageCost[gt]=15000&averageCost[lte]=20000')
          break
        case '20000-':
          queryParam.push('averageCost[gt]=20000')
          break
        default:
          break
      }
    }
    // Group: averageRating
    if (item[0] === 'ratingRange') {
      switch (item[1]) {
        case '1-3':
          queryParam.push('averageRating[gte]=1&averageRating[lte]=3')
          break
        case '3-6':
          queryParam.push('averageRating[gt]=3&averageRating[lte]=6')
          break
        case '6-9':
          queryParam.push('averageRating[gt]=6&averageRating[lte]=9')
          break
        case '9-10':
          queryParam.push('averageRating[gt]=9&averageRating[lte]=10')
          break
        default:
          break
      }
    }
  })

  return ({
    selectedOption: Object.fromEntries(queryArray),
    queryParam: queryParam.join('&')
  })
}
