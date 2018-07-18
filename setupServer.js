
// set up ======================================================================
// this file start the configuration service to set the values of serviceAccountKey.json, and of 
// config.js URL value for accessing mongoDB
// when both values are correct, the startServer function will start the folia services
var express = require('express')
var morgan=require('morgan')
var bodyParser = require('body-parser')
var fileUpload = require('express-fileupload');

var app = express()
var port = 8082

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

require('./app/route/setupRoutes.js')(app)
app.listen(port)
