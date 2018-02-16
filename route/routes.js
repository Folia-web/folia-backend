module.exports = function (app) {
  var folia = require('../analysis')

    // normal routes ===============================================================

    //###################################################################
    //--------------- UTILITY FUNCTIONS
    //###################################################################
    app.post('/images', function (req, res) {
      if(!req.files){
        return res.status(400).send('No file uploaded')
      }
        let leafId = req.body.leafId
        let leaf=req.files.leaf

        if(!leafId || !leaf){
          return res.status(400).send('Leaf parameters incorrect')
        }

        let coloriageId = req.body.coloriageId
        let coloriage=req.files.coloriage

        if(!coloriage || !coloriageId){
          return res.status(400).send('Coloriage parameters incorrect')
        }


        leaf.mv('/tmp/' + leafId)
        .then(function(){
          coloriage.mv('/tmp/' + coloriageId + '.png')
        })
        .then(function(){
          return res.status(200).send({operation:'upload',success:true})
        })
        .catch(function(err){
          console.log(err)
          return res.status(500).send({operation:'upload',success:false,message:'Problem check write access?'})
        });



    });


    app.get('/proxy/test',function(req,res){
      res.send(req.query)
    })


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
        folia.analysis( leaf, mask,res)

      }
    })


}
