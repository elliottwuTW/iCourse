const express = require('express')
const router = express.Router()

const { getUserOrders, createOrder, cancelOrder, getPaymentPage } = require('../../controllers/orders')

// route
router.get('/', getUserOrders)
router.post('/', createOrder)
router.put('/:id/cancel', cancelOrder)

router.get('/:id/payment', getPaymentPage)

module.exports = router
