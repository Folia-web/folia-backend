var process = require('child_process');
function analysis(leaf, color, res) {
    let base='/tmp/'
    let leafPath=base+leaf
    let colorPath = base + color + '.png'
    let maskPath = base + color + leaf + '.png'
    let csvPath= base+color+leaf +'.csv'
    var spw = process.spawn('sh', ['folia.sh',leafPath ,colorPath,maskPath,csvPath])
    //var spw = process.spawn('ping', ['-c', '5', '127.0.0.1']),

    str=""
    spw.stdout.on('data', (data) => {
      str += data.toString();

      // just so we can see the server is doing something
      console.log(str)
      // Flush out line by line.
      var lines = str.split("\n");
      for(var i in lines) {
          if(i == lines.length - 1) {
              str = lines[i];
          } else{
              // Note: The double-newline is *required*
              res.write('data:'+lines[i] + "\n\n");
          }
      }
    });

    spw.stderr.on('data', (data) => {
      console.log('stderr: ${data}');
    });

    spw.on('close', (code) => {

      res.write('data:EOF');
      res.end()
    });

}

module.exports = { analysis: analysis }
