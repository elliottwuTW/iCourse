const express = require('express')
const router = express.Router()

const { getUserOrders, createOrder, cancelOrder } = require('../../controllers/orders')

// route
router.get('/', getUserOrders)
router.post('/', createOrder)
router.put('/:id/cancel', cancelOrder)

module.exports = router
