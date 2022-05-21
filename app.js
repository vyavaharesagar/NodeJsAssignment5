const express = require('express');
const app = express();
const port = 3400



const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routes = require('./Routes')
app.use('/', routes);

const ejs = require("ejs")
app.set('views', './Views');
app.set('view engine', 'ejs');


const mongoose = require('mongoose');
const mongoURLCloud = "mongodb://127.0.0.1:27017/db_edureka";

mongoose.connect(mongoURLCloud,
    {
     useNewUrlParser: true,
     useUnifiedTopology: true
    }
    ).then(success=>{
        console.log("Connected to mongodb atlas");
        app.listen(port,()=>{
            console.log("app is running on port: ",port)
        })
    }).catch(err=>{
        console.log('Error Connecting to MongoDB Atlas !',err);
    })

    