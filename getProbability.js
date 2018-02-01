var folia = require('./analysis')
var leaf = "/home/test/Debian8_x64/ImagesFeuilles/1.jpg"
var color = "/home/test/Debian8_x64/ImagesFeuilles/coloriage/1.png"
var callBack = (err, stdout, sdtderr) => console.log(stdout)
folia.analysis(leaf, color, callBack)
