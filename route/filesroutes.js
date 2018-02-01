module.exports = function (app) {

    // normal routes ===============================================================
    var mongoose = require('mongoose');
    var Grid = require('gridfs-stream');


    //###################################################################
    //--------------- UTILITY FUNCTIONS
    //###################################################################







    // handle media posted by authenticated users
    app.post('/file', function (req, res) {
        var part = req.files;
        var mongoDriver = mongoose.mongo;
        var conn = mongoose.createConnection('mongodb://localhost/folia')
        conn.once('open', function () {
            var gfs = Grid(conn.db, mongoose.mongo);
            var writestream = gfs.createWriteStream({
                filename: part.file.name,
                mode: 'w',
                content_type: part.file.mimetype,
            });
            writestream.write(part.file.data);

            writestream.on('close', function () {
                res.send({
                    success: true, operation: 'create'
                });
            })
            writestream.end();

            // all set!
        })

    });





    app.delete('/file/:id', function (req, res) {
        var options = {
            _id: req.params.id
        };

        gfs.findOne(options, function (err, found) {
            if (found) {
                gfs.remove(options, function (err) {
                    if (err) {
                        res.send({
                            success: false
                        });
                    } else {
                        res.send({ success: true, resource: found.metadata, operation: 'delete' });

                    }

                });


            }
        });


    });


    // test function, not used in the web app
    app.get('/listAllFiles', function (req, res) {
        var conn = mongoose.createConnection('mongodb://localhost/folia')
        conn.once('open', function () {
            var gfs = Grid(conn.db, mongoose.mongo);

            gfs.files.find({}).toArray(function (err, files) {
                res.send(files);
            })
        })
    });


    app.get('/listImages', function (req, res) {
        var conn = mongoose.createConnection('mongodb://localhost/folia')
        conn.once('open', function () {
            var gfs = Grid(conn.db, mongoose.mongo);

            gfs.files.find({ contentType: /.*image.*/ }).toArray(function (err, files) {
                res.send(files);
            })
        })
    });


    // return all images files owned by the user execpt qr code


    /*
    Getting file by id, either the complete file (not a range request, in else), or 
    a partial content (for video/audio streaming)
    */
    app.get('/file/:id', function (req, res) {
        console.log(req.params)
        var conn = mongoose.createConnection('mongodb://localhost/folia')
        conn.once('open', function () {
            var gfs = Grid(conn.db, mongoose.mongo);

            gfs.files.find({
                _id: req.params.id
            }, function (err, file) {
                if (!file) {
                    res.send({
                        success: false
                    });
                    return;
                }

                var readstream = gfs.createReadStream({
                    _id: req.params.id
                });
                res.set('Content-Type', file.contentType);
                res.set('Content-Length', file.length);

                req.on('error', function (err) {
                    res.send(500, err);
                });
                readstream.on('error', function (err) {
                    res.send(500, err);
                });
                readstream.pipe(res);
            })
        }




        )
    });




}