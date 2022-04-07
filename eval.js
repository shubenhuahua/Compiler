const { abort } = require("process");

const eval_visitor = {
    number: function(content) {
        return Number(content);
    },
    multiple: function(left, symbol, right) {
        let left_value = left.visit(this);
        let right_value = right.visit(this);
        switch (symbol) {
            case "*":
                return left_value * right_value;
            case "/":
                return left_value / right_value;
            case "%":
                return left_value % right_value;
            default:
                console.log("unknown symbol", symbol, "in multiple expression");
                abort();
        }
    },
    addition: function(left, symbol, right) {
        var left_value = left.visit(this);
        var right_value = right.visit(this);
        switch (symbol) {
            case "+":
                return left_value + right_value;
            case "-":
                return left_value - right_value;
            default:
                console.log("unknown symbol", symbol, "in addition expression");
                abort();
        }
    },
    compare: function(left, symbol, right) {
        var left_value = left.visit(this);
        var right_value = right.visit(this);

        switch (symbol) {
            case ">=":
                return left_value >= right_value;
            case ">":
                return left_value > right_value;
            case "<=":
                return left_value <= right_value;
            case "<":
                return left_value < right_value;
            default:
                console.log("unknown symbol", symbol, "in compare expression");
                abort();
        }
    },
    requation: function(left, symbol, right) {
        var left_value = left.visit(this);
        var right_value = right.visit(this);
        switch (symbol) {
            case "===":
                return left_value === right_value;
            case "!==":
                return left_value !== right_value;
            default:
                console.log("unknown symbol", symbol, "in requation expression");
                abort();
        }
    },
    and: function(left, right) {
        var left_value = left.visit(this);
        var right_value = right.visit(this);
        if (!left_value) {
            return left_value;
        } else {
            return right_value;
        }
    },
    or: function(left, right) {
        var left_value = left.visit(this);
        var right_value = right.visit(this);
        if (left_value) {
            return left_value;
        } else {
            return right_value;
        }
    },
    ternary: function(left, right_l, right_r) {
        var left_value = left.visit(this);
        var right_l_value = right_l.visit(this);
        var right_r_value = right_r.visit(this);
        if (left_value) {
            return right_l_value;
        } else {
            return right_r_value;
        }
    }
};


function execute(statement) {
    let retval = statement.visit(eval_visitor); // Number(120)
    console.log(retval);
}

module.exports = {
    execute,
}