const express = require("express")
const app = express()

// import model

const OrderModel = require("../Models/OrderModel")



exports.addOrder = (req,res)=>{
    // console.log("body ==>",req.body,res)
    const order = Object.assign({}, req.body, {order_date: Date.now()})
    
    // console.log("order ==> ", order)
    OrderModel.create(order, (err,data)=>{
        if(err){
            console.log(err)
            res.status(500).send(err)
        }
        else{
            console.log(data)
            res.send(`Inserted ... ${data} `)
        }
    })
}


exports.enterOrder = (req,res)=>{
   
    res.render('OrderForm')
  
    
}
exports.getOrders = (req,res)=>{
    OrderModel.find({}, (err,data)=>{
        if(err)
            res.status(500).send(err)
        else
            res.json(data)
    })
}
exports.orderDashboard = (req,res)=>{
    OrderModel.find({},(err,resultdata)=>{
        if(err) res.status(500).send(err)
        else{
            console.log("data ==>",resultdata)
            const now = Date.now()
            let status
            let d0
            let sec
            const orders = resultdata.map(order=>{
                console.log("order ****** ",order)
                d0 = Number(order.order_date)
                sec = (now - d0)/1000
                if (sec<86400)        status = "In Progess"
                else if (sec>172800)  status = "Delivered"
                else                  status = "Dispatched"

                 //console.log(d0)
                 const d = new Date(d0).toLocaleDateString()
                 console.log(d)
                 order["order_date"] = d
                 order["order_status"] = status
                 return order
            })
            console.log("orders ==> ", orders)
            
            //binding result to data to be used in OrderStatus.ejs
            res.render('OrderStatus', {data: orders})
        }
    })
}
// exports.sendEmail = (req,res)=>{

// }

