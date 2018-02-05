module.exports = function (app) {
  var folia = require('./analysis')
  var callBack = (err, stdout, sdtderr) => console.log(stdout)

    // normal routes ===============================================================

    //###################################################################
    //--------------- UTILITY FUNCTIONS
    //###################################################################



    // handle media posted by authenticated users
    app.post('/leafimage', function (req, res) {
      if(!req.files){
        return res.status(400).send('No file uploaded')
      }
        let leaf = req.files.leaf;
        let name=req.files.leaf.name
        leaf.mv('/tmp/' +name,function(err){
          if(err)
            return res.status(500).send(err)

          res.send('upload success')
        })

    });

    app.post('/maskimage', function (req, res) {
      if(!req.files){
        return res.status(400).send('No file uploaded')
      }
        let mask = req.files.mask;
        let name=req.files.mask.name
        leaf.mv('/tmp/' +name,function(err){
          if(err)
            return res.status(500).send(err)

          res.send('upload success')
        })

    });


    app.get('/result',function(req,res){
      if(req.param('leafname') && req.param('maskname')){
        let leaf=req.param('leafname')
        let mask = req.param('maskname')
        folia.analysis(leaf,mask,callBack)

      }
    })


}
