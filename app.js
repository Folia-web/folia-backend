// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
const fileUpload = require('express-fileupload');

var app = express();
var port = 80;
app.use(fileUpload());
app.use(express.static(__dirname))
//Grid.mongo = mongoose.mongo;
// configuration ===============================================================






// routes ======================================================================
require('./route/routes.js')(app); // load our routes and pass in our app and fully configured passport
//require('./app/route/imageAnalysisRoute.js')(app, gfs,passport);

// launch ======================================================================
app.listen(port);
