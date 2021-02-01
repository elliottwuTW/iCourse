const express = require('express')
const router = express.Router()

const { getUserOrders, createOrder, cancelOrder, getPaymentPage, spgatewayCallback } = require('../../controllers/orders')

// route
router.get('/', getUserOrders)
router.post('/', createOrder)
router.put('/:id/cancel', cancelOrder)

router.get('/:id/payment', getPaymentPage)
router.post('/spgateway/callback', spgatewayCallback)

module.exports = router
