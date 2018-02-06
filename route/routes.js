module.exports = function (app) {
  var folia = require('../analysis')

    // normal routes ===============================================================

    //###################################################################
    //--------------- UTILITY FUNCTIONS
    //###################################################################



    // handle media posted by authenticated users
    app.post('/leafimage', function (req, res) {
      if(!req.files){
        return res.status(400).send('No file uploaded')
      }
        let id = req.body.id
        let leaf=req.files.leaf
        leaf.mv('/tmp/' +id,function(err){
          if(err)
            return res.status(500).send(err)

          res.send('upload success')
        })

    });

    app.post('/maskimage', function (req, res) {
      if(!req.files){
        return res.status(400).send('No file uploaded')
      }
        let id = req.body.id
        let mask = req.files.mask;
        mask.mv('/tmp/' + id,function(err){
          if(err)
            return res.status(500).send(err)

          res.send('upload success')
        })

    });


    app.get('/result',function(req,res){
      res.writeHead(200, { "Content-Type": "text/event-stream",
                           "Cache-control": "no-cache" });
      if(req.query.leafId && req.query.maskId){
        let leaf=req.query.leafId
        let mask = req.query.maskId
        folia.analysis('/tmp/' + leaf,'/tmp/' + mask,res)

      }
    })


}
