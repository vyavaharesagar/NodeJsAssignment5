
const express = require('express');
// create router

const router = express.Router();

//import controller
const orderController = require("../Controllers/OrderController")


// declare the routes
router.post('/addOrder',orderController.addOrder)
router.get("/enterOrder",orderController.enterOrder)
router.get("/getOrders",orderController.getOrders)
router.get("/orderDashboard",orderController.orderDashboard)
// router.get("/sendEmail/:email",orderController.sendEmail)

module.exports = router;


