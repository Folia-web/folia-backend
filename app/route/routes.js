module.exports = function(app, fireDB, gfs) {
  var folia = require("../analysis");
  var fs = require("fs");
  var async = require("async");
  var foliaExec = require("../models/foliaExec");
  // normal routes ===============================================================

  //###################################################################
  //--------------- UTILITY FUNCTIONS
  //###################################################################

  
  function startAnalysis(foliaInstance, callback) {
    folia.analysis(foliaInstance, fireDB);
  }

  function writeFiles(foliaInstance, callback) {
    let coloriageBase64 = foliaInstance.coloriageFileBase64.replace(
      /^data:image\/png;base64,/,
      ""
    );
    let leafReadStream = gfs.createReadStream({ _id: foliaInstance.leafId });
    let leafWriteStream = fs.createWriteStream(
      "/tmp/" + foliaInstance.leafId
    );
    async.series([
      async.apply(fs.writeFile, "/tmp/"+foliaInstance.colorFilename,coloriageBase64, 'base64'),
      ()=>  leafReadStream
      .pipe(leafWriteStream)
      .on("error", () => {
        console.log("err");
      })
      .on("finish", () => {
        callback(null, foliaInstance);
      })
    ],()=>{callback(null,foliaInstance)})
/*
    leafReadStream
      .pipe(leafWriteStream)
      .on("error", () => {
        console.log("err");
      })
      .on("finish", () => {
        callback(null, foliaInstance);
      });*/
  }

  app.get("/setupImages/:id", function(req, res) {
    var query = fn => foliaExec.findById(req.params.id, null, null, fn).exec;
    async.waterfall([query, async.apply(writeFiles)], function(err, result) {
      res.send({ msg: "Starting compute" });
      startAnalysis(result,fireDB)
    });
  });
};
