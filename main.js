const fs = require("fs");
const token = require("./token.js");
const parser = require("./parser.js");
const executor = require("./eval.js");

function list_tokens(data) {
    let i = 0;
    while (true) {
        let tok = token.next_token(data, i);
        i = tok.i;
        console.log(tok.content, " => ", tok.type);
        if (tok.type === token.BAD) {
            console.log("borken token, break parsing");
            break;
        } else if (tok.type === token.EOF) {
            break;
        }
    }
}

function parse_and_execute(data) {
    let scanner = {
        data: data,
        consumed_pos: 0,
        token: function() {
            if (!this.saved_token) {
                this.saved_token = token.next_token(data, this.consumed_pos);
            }
            return this.saved_token;
        },
        advance: function(skip_whitespace) {
            if (this.saved_token) {
                this.consumed_pos = this.saved_token.i;
                this.saved_token = null;
            }
            while (true) {
                let tok = this.token();
                if (skip_whitespace && tok.type == token.WHITESPACE) {
                    this.consumed_pos = tok.i;
                    this.saved_token = null;
                    continue;
                }
                return tok;
            }
        },
        saved_token: null,
    };

    scanner.advance(true);
    let statements = parser.parse_statements(scanner);
    executor.execute(statements);
}

fs.readFile("./test.js", "utf8", function(err, data) {
    if (err) {
        console.log("文件读取失败！");
        return;
    }
    data = data.trim();

    let is_list_token = false;
    if (is_list_token)
        list_tokens(data);
    else
        parse_and_execute(data);
});