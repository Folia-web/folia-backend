var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var foliaExecSchema = mongoose.Schema({
    stdout:Array,
    resultCSV:Array,
    playerID :String,
    maskFileBase64:String,
    label: String,
    owner: String,
    status: String,
    coloriageFileBase64: String,
    colorFilename:String,
    leafId: String,
    leafFilename:String,
    leafContentType:String,
    leafLength:Number,
})

module.exports = mongoose.model('FoliaExec', foliaExecSchema);
