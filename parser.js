const { BAD, NUMBER, USER_ID, STRINGS, RESERVED_ID, SYMBOL, WHITESPACE } = require("./token.js");
const { abort } = require("process");

function unexpect(tok, msg) {
    console.log("unexpect token type", tok.type, "index", tok.i, "content", tok.content, msg);
    abort();
}
// 把一个数字字符串转换为数字类型
function make_number_expr(content) {
    return {
        content: content,
        visit: function(visitor) {
            return visitor.number(this.content);
        }
    };
}

function parse_unary_expr(scanner) {
    let tok = scanner.token();
    if (tok.type != NUMBER) {
        unexpect(tok, "should be a NUMBER");
    }
    scanner.advance(true);
    return make_number_expr(tok.content);
}

function parse_expect_symbol(scanner, expect) {
    let symbol = scanner.token();
    if (symbol.type != SYMBOL ||
        !expect.test(symbol.content)) {
        return null;
    }

    scanner.advance(true);
    return symbol.content;
}

function parse_multiply_expr(scanner) {
    let left = parse_unary_expr(scanner);
    while (true) {
        let symbol = parse_expect_symbol(scanner, /\*|\/|%/);
        if (!symbol)
            return left;
        let right = parse_unary_expr(scanner);
        left = {
            left: left,
            right: right,
            symbol: symbol,
            visit: function(visitor) {
                return visitor.multiple(this.left, this.symbol, this.right);
            },
        };
    }
}

function parse_addition_expr(scanner) {
    let left = parse_multiply_expr(scanner);
    while (true) {
        let symbol = parse_expect_symbol(scanner, /\+|\-/);
        if (!symbol)
            return left;
        let right = parse_multiply_expr(scanner);

        left = {
            left: left,
            right: right,
            symbol: symbol,
            visit: function(visitor) {
                return visitor.addition(this.left, this.symbol, this.right);
            },
        };
    }

}

function parse_expect_cop_symbol(scanner) {
    let symbol = scanner.token();
    if (symbol.type !== SYMBOL || !/\>|\</.test(symbol.content)) {
        return null;
    }
    let next = scanner.advance(false);
    // console.log(next.content);

    if (next.type === SYMBOL) {
        symbol.content += next.content;
        scanner.advance(true);
    } else if (next.type === WHITESPACE) {
        scanner.advance(true);
    }
    return symbol.content;
}
// 解析不等式运算
function parse_compare_expr(scanner) {
    let left = parse_addition_expr(scanner);
    let symbol = parse_expect_cop_symbol(scanner);
    if (!symbol) {
        return left;
    }
    let right = parse_addition_expr(scanner);
    return {
        left: left,
        right: right,
        symbol: symbol,
        visit: function(visitor) {
            return visitor.compare(this.left, this.symbol, this.right);
        },
    }
}
// 解析等式运算
function parse_expect_req_symbol(scanner) {
    let symbol = scanner.token();
    if (symbol.type !== SYMBOL || !/\=|\!/.test(symbol.content)) {
        return null;
    }

    let secd = scanner.advance(false);

    if (secd.type === SYMBOL) {
        symbol.content += secd.content;
        scanner.advance(true);

    } else if (secd.type === WHITESPACE) {
        scanner.advance(true);
    }
    let three = scanner.token();
    if (three.type == SYMBOL) {
        symbol.content += three.content;
        scanner.advance(true);
    } else if (secd.type === WHITESPACE) {
        scanner.advance(true);
    }
    return symbol.content;

}

function parse_requation_expr(scanner) {
    let left = parse_compare_expr(scanner);
    let symbol = parse_expect_req_symbol(scanner);
    if (!symbol) {
        return left;
    }
    let right = parse_compare_expr(scanner);
    return {
        left: left,
        right: right,
        symbol: symbol,
        visit: function(visitor) {
            return visitor.requation(this.left, this.symbol, this.right);
        },
    }
}

//解析逻辑与
function parse_expect_andOr_expr(scanner, expect) {
    let symbol = scanner.token();
    if (symbol.type !== SYMBOL || !expect.test(symbol.content)) {
        return null;
    }
    let next = scanner.advance(false);
    if (next.type === SYMBOL) {
        symbol.content += next.content;
        scanner.advance(true);
    } else if (next.type === WHITESPACE) {
        scanner.advance(true);
    }

    return symbol.content;
}

function parse_And_expr(scanner) {
    let left = parse_requation_expr(scanner);
    let symbol = parse_expect_andOr_expr(scanner, /\&/);
    if (!symbol) {
        return left;
    }
    let right = parse_requation_expr(scanner);
    return {
        left: left,
        right: right,
        symbol: symbol,
        visit: function(visitor) {
            return visitor.and(this.left, this.right);
        },
    }
}
// 解析逻辑或
function parse_Or_expr(scanner) {
    let left = parse_And_expr(scanner);
    let symbol = parse_expect_andOr_expr(scanner, /\|/);
    if (!symbol) {
        return left;
    }
    let right = parse_And_expr(scanner);
    return {
        left: left,
        right: right,
        symbol: symbol,
        visit: function(visitor) {
            return visitor.or(this.left, this.right);
        },
    }
}
// 解析三元运算符
function parse_expect_ternary_symbol(scanner, expect) {
    let symbol = scanner.token();
    if (symbol.type != SYMBOL || !expect.test(symbol.content)) {
        return null;
    }
    scanner.advance(true);
    return symbol.content;
}

function parse_ternary_expr(scanner) {
    let left = parse_Or_expr(scanner);
    let symbol = parse_expect_ternary_symbol(scanner, /\?/);
    if (!symbol) {
        return left;
    }
    let right_l = parse_Or_expr(scanner);
    let colon = parse_expect_ternary_symbol(scanner, /\:/);
    if (!colon) {
        return false;
    }
    let right_r = parse_Or_expr(scanner);
    return {
        left: left,
        right_l: right_l,
        right_r: right_r,
        symbol: symbol,
        colon: colon,
        visit: function(visitor) {
            return visitor.ternary(this.left, this.right_l, this.right_r);
        },
    }

}

function parse_statements(scanner) {
    return parse_ternary_expr(scanner);
}

module.exports = {
    parse_statements,
}