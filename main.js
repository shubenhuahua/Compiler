const fs = require("fs");

fs.readFile("./test.js", "utf8", function(err, data) {
    if (err) {
        console.log("文件读取失败！");
        return;
    }
    console.log(data);
});