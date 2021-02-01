const asyncUtil = require('../middleware/asyncUtil')

const fetchData = require('../utils/fetchData')
const getTradeInfo = require('../utils/getTradeInfo')

// @desc    get orders of an user
// @route   GET /orders
exports.getUserOrders = asyncUtil(async (req, res, next) => {
  const userId = req.user.id
  const ordersResult = await fetchData(req, {
    method: 'get',
    path: `/users/${userId}/orders`
  })

  return res.render('orders', { orders: ordersResult.data })
})

// @desc    create an order
// @route   POST /orders
exports.createOrder = asyncUtil(async (req, res, next) => {
  await fetchData(req, {
    method: 'post',
    path: '/orders',
    data: req.body
  })

  return res.redirect('/orders')
})

// @desc    cancel an order
// @route   PUT /orders/:id/cancel
exports.cancelOrder = asyncUtil(async (req, res, next) => {
  await fetchData(req, {
    method: 'put',
    path: `/orders/${req.params.id}/cancel`
  })

  return res.redirect('/orders')
})

// @desc    get payment page to POST request to spgateway
// @route   GET /orders/:id/payment
exports.getPaymentPage = asyncUtil(async (req, res, next) => {
  // get order
  const orderResult = await fetchData(req, {
    method: 'get',
    path: `/orders/${req.params.id}`
  })

  // get trade parameters information
  const order = orderResult.data
  const tradeInfo = getTradeInfo(order.amount, `iCourse order from ${order.name}`, order.User.email)

  console.log('tradeInfo: ', tradeInfo)

  return res.render('payment', {
    order,
    tradeInfo
  })
})
