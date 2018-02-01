module.exports = function (app, webdir) {

    // normal routes ===============================================================
    var express = require('express');

    app.use(express.static(webdir));


}