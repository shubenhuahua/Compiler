const fs = require("fs");

fs.readFile("./test.js", "utf8", function(err, data) {
    if (err) {
        console.log("文件读取失败！");
        return;
    }
    // console.log(typeof(data));
    data = data.trim();
    for (var i = 0; i < data.length; i++) {
        if (data[i] === " ") {
            console.log("-")
        } else if (data[i] === '\n') {
            console.log('\\n')
        } else if (data[i] === "\"") {
            console.log("\"")
        } else {
            console.log(data[i]);
        }
    }
});