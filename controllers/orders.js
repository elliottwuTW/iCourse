const asyncUtil = require('../middleware/asyncUtil')

const fetchData = require('../utils/fetchData')

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
