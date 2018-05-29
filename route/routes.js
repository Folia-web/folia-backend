module.exports = function (app) {
  var folia = require('../analysis')
  var fs = require('fs')
  // normal routes ===============================================================

  //###################################################################
  //--------------- UTILITY FUNCTIONS
  //###################################################################
  app.post('/images', function (req, res) {
    if (!req.files) {
      return res.status(400).send('No file uploaded')
    }
    let leafId = req.body.leaf._id
    let leaf = req.files.leaf

    if (!leafId || !leaf) {
      return res.status(400).send('Leaf parameters incorrect')
    }

    let base64Image = req.body.coloriage.base64Image.replace(/^data:image\/png;base64,/, "");

    if (!coloriage) {
      return res.status(400).send('Coloriage parameters incorrect')
    }


    leaf.mv('/tmp/' + leafId)
      .then(function () {

        fs.writeFile("/tmp/"+leafId+"color.png", base64Data, 'base64', function (err) {
          console.log(err);
        });
      })
      .then(function () {
        return res.status(200).send({ operation: 'upload', success: true })
      })
      .catch(function (err) {
        console.log(err)
        return res.status(500).send({ operation: 'upload', success: false, message: 'Problem check write access?' })
      });
  });


  app.get('/mask/:id', function (req, res) {
    res.download('/tmp/' + req.params.id + '.png')
  })

  app.get('/stringResult/:id', function (req, res) {
    fs.readFile('/tmp/' + req.params.id + '.csv', 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('FIle path problem')
      }
      res.send(data)
    })
  })

  app.get('/result/:id', function (req, res) {
    res.download('/tmp/' + req.params.id + '.csv')
  })

  // handle media posted by authenticated users



  app.get('/result', function (req, res) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-control": "no-cache"
    });
    if (req.query.leafId && req.query.maskId) {
      let leaf = req.query.leafId
      let mask = req.query.maskId
      folia.analysis(leaf, mask, res)

    }
  })


}
