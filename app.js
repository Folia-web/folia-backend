
// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
const fileUpload = require('express-fileupload');

var app      = express();
var port     = 8181;
app.use(fileUpload());

//Grid.mongo = mongoose.mongo;
// configuration ===============================================================





// routes ======================================================================
require('./route/routes.js')(app,'../folia_web/'); // load our routes and pass in our app and fully configured passport
require('./route/filesroutes.js')(app);
//require('./app/route/imageAnalysisRoute.js')(app, gfs,passport);

// launch ======================================================================
app.listen(port);
