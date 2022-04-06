const { abort } = require("process");

const WHITESPACE = 0; // '\n' '\t' ' ' 
const RESERVED_ID = 1; // if else switch case ....
const USER_ID = 2; // next_token ....
const NUMBER = 3; // 123 1.1231
const STRINGS = 4; // "asdf"   content = asdf
const SYMBOL = 5; // { } () , + - * / . = > <   
const EOF = 6; // END OF FILE
const BAD = 7;

let keywords = new Set();
keywords.add("if");
keywords.add("else");
keywords.add("abstract");
keywords.add("booolean");
keywords.add("break");
keywords.add("byte");
keywords.add("case");
keywords.add("catch");
keywords.add("char");
keywords.add("class");
keywords.add("const");
keywords.add("continue");
keywords.add("debugger");
keywords.add("default");
keywords.add("delete");
keywords.add("do");
keywords.add("double");
keywords.add("else");
keywords.add("enum");
keywords.add("export");
keywords.add("extends");
keywords.add("false");
keywords.add("final");
keywords.add("finally");
keywords.add("float");
keywords.add("for");
keywords.add("function");
keywords.add("goto");
keywords.add("if");
keywords.add("if");
keywords.add("implements");
keywords.add("import");
keywords.add("in");
keywords.add("instanceof");
keywords.add("int");
keywords.add("interface");
keywords.add("long");
keywords.add("native");
keywords.add("new");
keywords.add("null");
keywords.add("package");
keywords.add("private");
keywords.add("protected");
keywords.add("public");
keywords.add("return");
keywords.add("short");
keywords.add("super");
keywords.add("switch");
keywords.add("synchronized");
keywords.add("this");
keywords.add("throw");
keywords.add("throws");
keywords.add("transient");
keywords.add("true");
keywords.add("try");
keywords.add("typeof");
keywords.add("var");
keywords.add("volatile");
keywords.add("void");
keywords.add("while");
keywords.add("with");

function expect(content) {
    console.log("expect", content);
    return {
        i: 0,
        content: "",
        type: BAD,
    }
}
// 解析标识符
var letter = /[a-zA-Z]/;
var patt = /[a-zA-Z0-9_]/;

function parse_names(data, i) {
    var content = data[i];
    if (letter.test(data[i])) {
        i += 1;
        for (; i < data.length; i++) {
            if (patt.test(data[i])) {
                content += data[i];
                continue;
            } else {
                break;
            }

        }
    }
    // 解析关键字（保留字）
    if (keywords.has(content)) {
        return {
            i: i,
            content: content,
            type: RESERVED_ID,
        }
    }
    return {
        i: i,
        content: content,
        type: USER_ID,
    }


}
//解析空白
function parse_white_space(data, i) {

    for (; i < data.length; i++) {
        if (data[i] === ' ' ||
            data[i] === '\t' ||
            data[i] === '\n') {
            continue;
        }
        break;
    }
    return {
        i: i,
        content: '-',
        type: WHITESPACE,
    }
}
//解析字符串
function parse_strings(data, i) {

    // console.log(data.length, i)
    i = i + 1;
    if (data.length <= i) {
        return expect("\"");
    }

    var content = "";
    let is_matched = false;
    for (; i < data.length; i++) {
        if (data[i] === '\'' || data[i] === '\"') {
            is_matched = true;
            break;
        }

        if (data[i] === "\\") {
            i += 1;
            if (data.length < i) {
                return {
                    i: i,
                    content: false,
                    type: BAD,
                }
            }
            switch (data[i]) {
                case "\"":
                    content += "\"";
                    i++;
                    break;
                case "\'":
                    content += "\'";
                    i++;
                    break;
                case "\\":
                    content += "\\";
                    i++;
                    break;
                case "\/":
                    content += "\/";
                    i++;
                    break;
                case "b":
                    content += "\b";
                    i++;
                    break;
                case "f":
                    content += "\f";
                    i++;
                    break;
                case "n":
                    content += "\n";
                    i++;
                    break;
                case "r":
                    content += "\\r";
                    i++;
                    break;
                case "t":
                    content += "\t";
                    i++;
                    break;
                default:
                    return {
                        i: i,
                        content: false,
                        type: BAD,
                    }
            }
        }
        content += data[i];
    }
    if (!is_matched) {
        return expect("\"");
    }
    i += 1;

    return {
        i: i,
        content: content,
        type: STRINGS,
    }
}
//解析数字
function parse_number(data, i) {
    var content = data[i];
    if (data[i] >= "1" && data[i] <= "9") {
        i += 1;
        for (; i < data.length; i++) {
            if (data[i] >= "1" && data[i] <= "9") {
                content += data[i];
                continue;
            } else {
                break;
            }
        }
    } else {
        i += 1;
    }
    if (data[i] === ".") {
        content += data[i];
        i += 1;
        for (; i < data.length; i++) {
            if (data[i] >= "1" && data[i] <= "9") {
                content += data[i];
                continue;
            } else {
                break;
            }
        }
    }
    return {
        i: i,
        content: content,
        type: NUMBER,
    }
}

function next_token(data, i) {
    switch (data[i]) {
        case ' ':
        case '\t':
        case '\n':
            return parse_white_space(data, i);

        case '\"':
        case '\'':
            return parse_strings(data, i);
            // case "n":
            //     return parse_names(data, i);
        default:
            if (letter.test(data[i])) {
                return parse_names(data, i);
            }
            if (data[i] >= "0" && data[i] <= "9") {
                return parse_number(data, i);
            }



    }
}

module.exports = {
    next_token,
    WHITESPACE,
    RESERVED_ID,
    USER_ID,
    NUMBER,
    STRINGS,
    SYMBOL,
    EOF,
    BAD,
}

function assert(lhs, rhs) {
    if (!(lhs === rhs)) {
        console.log(lhs, " != ", rhs);
        abort();
    }
}

"'\\'"
"'\\j'"