// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var morgan=require('morgan')
const fileUpload = require('express-fileupload');
var app = express();
var port = 8081;
app.use(morgan('dev')); // log every request to the console

app.use(fileUpload());
//Grid.mongo = mongoose.mongo;
// configuration ===============================================================






// routes ======================================================================
require('./route/routes.js')(app); // load our routes and pass in our app and fully configured passport
//require('./app/route/imageAnalysisRoute.js')(app, gfs,passport);

// launch ======================================================================
app.listen(port);
