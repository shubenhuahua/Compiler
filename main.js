const fs = require("fs");

fs.readFile("./test.js", "utf8", function(err, data) {
    if (err) {
        console.log("文件读取失败！");
        return;
    }
    data = data.trim();
    for (var i = 0; i < data.length; i++) {
        switch (data[i]) {
            case " ":
                console.log("-");
                break;
            case "\n":
                console.log("\\n");
                break;
            case "\"":
                console.log("\"");
                break;
            default:
                console.log(data[i]);
                break;
        }
    }
});