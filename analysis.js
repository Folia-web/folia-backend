var execSh = require("exec-sh");
const execFile = require('child_process').exec;
function analysis(leaf, color, callback) {
    execSh(["sh folia.sh " + leaf + " " + color + " " + "./img.png /dev/null"],
        (err, stdout, stderr) => callback(err, stdout, stderr)
    )
}

module.exports = { analysis: analysis }