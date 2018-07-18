var childProcess = require("child_process");
var fs = require("fs");
var LineByLineReader = require("line-by-line");
var pidusage = require("pidusage");

function setUpDB(userId, fireDB) {
  // fireDB.ref("users/" + userId + "/" + "folia/").remove();
  let currentSession = fireDB.ref("users/" + userId + "/" + "folia/messages/");
  let currentErrors = fireDB.ref("users/" + userId + "/" + "folia/errors/");
  let currentSessionEnd = fireDB.ref("users/" + userId + "/" + "folia/end/");
  return {
    currentSession: currentSession,
    currentErrors: currentErrors,
    currentSessionEnd: currentSessionEnd
  };
}

function saveSessionValues(
  foliaInstance,
  maskPath,
  csvPath,
  currentSessionEnd
) {
  var resultCSV = [];
  lr = new LineByLineReader(csvPath);
  lr.on("error", function(err) {
    //foliaInstance.resultCSV.
  });

  lr.on("line", function(line) {
    resultCSV.push(line);
  });

  lr.on("end", function() {
    foliaInstance.resultCSV = resultCSV;
    foliaInstance.save(function(err, result) {
      console.log(err);
    });
    var triggerEnd = currentSessionEnd.push();
    triggerEnd.set({ session: "end" });
    // All lines are read, file is closed now.
  });
}

function analysis(foliaInstance, fireDB) {
  let fireSession = setUpDB(foliaInstance.playerID, fireDB);
  let currentSession = fireSession.currentSession;
  let currentErrors = fireSession.currentErrors;
  let currentSessionEnd = fireSession.currentSessionEnd;

  let base = "/tmp/";
  let leafPath = base + foliaInstance.leafFilename;
  let colorPath = base + foliaInstance.colorFilename;
  let maskPath = base + foliaInstance.leafFilename + "mask.png";
  let csvPath = base + foliaInstance.leafFilename + ".mask.csv";
  var spw = childProcess.spawn(process.env.FOLIA_PATH, [
    leafPath,
    colorPath,
    maskPath,
    csvPath
  ],{cwd:process.env.FOLIA_CWD});
 let timeout= setTimeout(function(){spw.kill()},30000)
  console.log(leafPath + ' ' + colorPath+ ' ' + maskPath + ' '+ csvPath)
  //var spw = process.spawn('ping', ['-c', '5', '127.0.0.1']),
  str = "";
  spw.stdout.on("data", data => {
    str += data.toString();
    console.log(data.toString())
    // just so we can see the server is doing something
    // Flush out line by line.
    var lines = str.split("\n");
    for (var i in lines) {
      if (i == lines.length - 1) {
        str = lines[i];
      } else {
        // Note: The double-newline is *required*
        var newElem = currentSession.push();
        newElem.set({ data: lines[i].substring(0,100) });
      }
    }
  });

  spw.stderr.on("data", data => {
    console.log(data.toString())
    var newElem = currentErrors.push();
    newElem.set({ error: data.toString() });
  });

  spw.on("close", (code) => {
    clearTimeout(timeout)
    console.log(code)

    if (code === 0) {
      saveSessionValues(foliaInstance, maskPath, csvPath, currentSessionEnd);

    } 
    else
    {
      
      var newElem = currentErrors.push();
      newElem.set({ error: 'Erreur imprévue' });
    }
  });
}

module.exports = { analysis: analysis };
