// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var morgan=require('morgan')
var firebase = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
const fileUpload = require('express-fileupload');
var app = express();
var port = 8081;
app.use(morgan('dev')); // log every request to the console
app.use(fileUpload());
firebase.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://rev-game-6e36a.firebaseio.com"
  });
var db =firebase.database()
var users=db.ref('users/')

users.once('value').then(function(snap){
    console.log(snap.val())
})



require('./route/routes.js')(app); // load our routes and pass in our app and fully configured passport
app.listen(port);
