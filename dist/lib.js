"use strict";
/**
 * Returns a processed argument array, combining quote-enclosed strings.
 * @param args The arguments to process.
 */
function getEnclosed(args) {
    const res = [];
    let buffer = [];
    let symbol = "";
    for (const arg of args) {
        if ((arg[0] === "\"" || arg[0] === "'") && arg.length > 1 && buffer.length === 0) {
            symbol = arg[0];
            buffer.push(arg.substring(1));
        }
        else if (arg[arg.length - 1] === symbol && arg.length > 1 && buffer.length !== 0) {
            buffer.push(arg.substring(0, arg.length - 1));
            symbol = "";
            res.push(buffer.join(" "));
            buffer = [];
        }
        else if (buffer.length !== 0) {
            buffer.push(arg);
        }
        else {
            res.push(arg);
        }
    }
    return res;
}
/**
 * Returns an array of command-line options parsed from the argument array.
 * @param args The argument array to parse.
 * @param defs An array of option definitions.
 */
function getOptions(args, defs = []) {
    const reg1 = new RegExp(/\-\-?(\w+)/);
    const res = {};
    let i = args.findIndex((e) => reg1.test(e));
    while (i !== -1) {
        const def = defs.find((e) => `--${e.name}` === args[i] || `-${e.alias}` === args[i]);
        if (def !== undefined) {
            if (res[def.name] === undefined) {
                if (def.switch) {
                    args.splice(i, 1);
                    res[def.name] = true;
                }
                else {
                    if (args[i + 1] !== undefined) {
                        let val = args[i + 1];
                        switch (def.type) {
                            case "boolean":
                                if (val === "true") {
                                    val = true;
                                }
                                else {
                                    val = false;
                                }
                                break;
                            case "json":
                                try {
                                    val = JSON.parse(val);
                                }
                                catch (e) {
                                    val = null;
                                }
                                break;
                            case "string":
                                val = val;
                                break;
                            case "number":
                                if (!isNaN(val)) {
                                    val = Number(val);
                                }
                                else {
                                    val = 0;
                                }
                                break;
                            default:
                                break;
                        }
                        res.push({
                            name: def.name,
                            value: val,
                        });
                        args.splice(i, 2);
                    }
                    else {
                        res.push({
                            name: def.name,
                            value: null,
                        });
                        args.splice(i, 1);
                    }
                }
            }
            else {
                if (def.switch) {
                    args.splice(i, 1);
                }
                else {
                    args.splice(i, 2);
                }
            }
        }
        i = args.findIndex((e) => reg1.test(e));
    }
    return res;
}
/**
 * Returns the processed arguments array and an object containing the options parsed.
 * @param {string[]} args Arguments array. Default: process.argv.slice(2)
 * @param {ArgueTS.IOptionDef[]} defs Option definition array. Default: undefined.
 */
function ArgueTS(args = process.argv.slice(2), defs) {
    args = getEnclosed(args);
    const options = getOptions(args, defs);
    return {
        args,
        options,
    };
}
module.exports = ArgueTS;
