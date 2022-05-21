const express = require("express")
const app = express()

// import model

const OrderModel = require("../Models/OrderModel")

require('dotenv').config()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.addOrder = (req,res)=>{
    // console.log("body ==>",req.body,res)
    const order = Object.assign({}, req.body, {order_date: Date.now()})
    
    // console.log("order ==> ", order)
    OrderModel.create(order, (err,data)=>{
        if(err){
            // console.log(err)
            res.status(500).send(err)
        }
        else{
            // console.log(data)
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
            // console.log("data ==>",resultdata)
            const now = Date.now()
            let status
            let d0
            let sec
            const orders = resultdata.map(order=>{
                // console.log("order ****** ",order)
                d0 = Number(order.order_date)
                sec = (now - d0)/1000
                if (sec<86400)        status = "In Progess"
                else if (sec>172800)  status = "Delivered"
                else                  status = "Dispatched"

                 //console.log(d0)
                 const d = new Date(d0).toLocaleDateString()
                //  console.log(d)
                 order["order_date"] = d
                 order["order_status"] = status
                 return order
            })
            // console.log("orders ==> ", orders)
            
            //binding result to data to be used in OrderStatus.ejs
            res.render('OrderStatus', {data: orders})
        }
    })
}
exports.sendEmail = (req,res)=>{
    const email = req.params.email
    // console.log("email ==> ", email)
    OrderModel.find({}, (err,data)=>{
        if(err) res.status(500).send(err)
        else{
            // console.log("data ==> ", data)
            const now = Date.now()
            let status
            let d0
            let sec
            const orders = data.map( order => {
                // console.log("order ****** ", order)
                d0 = Number(order.order_date)
                sec = (now - d0)/1000
                if (sec<86400)        status = "In Progess"
                else if (sec>172800)  status = "Delivered"
                else                  status = "Dispatched"
                
                //console.log(d0)
                const d = new Date(d0).toLocaleDateString()
                // console.log(d)
                order["order_date"] = d
                order["order_status"] = status
                return order
                //return Object.assign({}, order, {order_date: d}, {order_status: status})
            })
            console.log("orders ==> ", orders)
            const contentText = JSON.stringify(orders, null, 4)
            const contentHtml = "<div><h3>" + contentText + "</h3></div>"
            const msg = {
                to: email,
                from: 'tailu@ie-sd.com',
                subject: 'Your Order Status',
                text: contentText,
                html: contentHtml,
            };
            sgMail.send(msg).then(
                console.log("msg ==> ", msg)
                
            ).catch(err=>{
                console.log(err)
            });
            res.send("Email sent to " + email)
            // 
        }
    })
}

