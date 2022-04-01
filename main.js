const fs = require("fs");
const token = require("./token.js");

fs.readFile("./test.js", "utf8", function(err, data) {
    if (err) {
        console.log("文件读取失败！");
        return;
    }
    data = data.trim();
    for (var i = 0; i < data.length;) {
        let tok = token.next_token(data, i);
        i = tok.i;
        console.log(tok.content, " => ", tok.type);
    }
});