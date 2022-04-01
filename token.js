const { abort } = require("process");

const WHITESPACE = 0; // '\n' '\t' ' ' 
const RESERVED_ID = 1; // if else switch case ....
const USER_ID = 2; // next_token ....
const NUMBER = 3; // 123 1.1231
const STRINGS = 4; // "asdf"   content = asdf
const SYMBOL = 5; // { } () , + - * / . = > <   
const EOF = 6; // END OF FILE
const BAD = 7;

function expect(content) {
    console.log("expect", content);
    return {
        i: 0,
        content: "",
        type: BAD,
    }
}

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
        default:
            if (data[i] >= "0" && data[i] <= "9") {
                return parse_number(data, i);
            }



    }
}

module.exports = {
    next_token,
}

function assert(lhs, rhs) {
    if (!(lhs === rhs)) {
        console.log(lhs, " != ", rhs);
        abort();
    }
}