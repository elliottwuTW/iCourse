const asyncUtil = require('../middleware/asyncUtil')

const fetchData = require('../utils/fetchData')
const { getTradeInfo, decryptAES256 } = require('../utils/handleTrade')

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

  // update sn of order to keep tracked after spgateway callback
  await fetchData(req, {
    method: 'put',
    path: `/orders/${req.params.id}`,
    data: { sn: tradeInfo.sn }
  })

  return res.render('payment', {
    order,
    tradeInfo
  })
})

// @desc    display finish message to remind user
// @route   POST /orders/spgateway/callback
exports.spgatewayCallback = asyncUtil(async (req, res, next) => {
  const response = req.body
  if (response.Status === 'SUCCESS') {
    const decoded = decryptAES256(response.TradeInfo, process.env.HASH_KEY, process.env.HASH_IV)
    const data = JSON.parse(decoded)

    // update order paymentStatus
    const sn = data.Result.MerchantOrderNo
    await fetchData(req, {
      method: 'put',
      path: `/orders/sn/${sn}`,
      data: { paymentStatus: '1' },
      config: { payment_status_secret: process.env.UPDATE_PAYMENT_STATUS }
    })

    return res.redirect('/orders')
  }
})
