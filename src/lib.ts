/**
 * Returns a processed argument array, combining quote-enclosed strings.
 * @param args The arguments to process.
 */
function getEnclosed(args: string[]): string[] {
    const res: string[] = [];
    let buffer: string[] = [];
    let symbol: string = "";
    for (const arg of args) {
        if ((arg[0] === "\"" || arg[0] === "'") && arg.length > 1 && buffer.length === 0) {
            symbol = arg[0];
            buffer.push(arg.substring(1));
        } else if (arg[arg.length - 1] === symbol && arg.length > 1 && buffer.length !== 0) {
            buffer.push(arg.substring(0, arg.length - 1));
            symbol = "";
            res.push(buffer.join(" "));
            buffer = [];
        } else if (buffer.length !== 0) {
            buffer.push(arg);
        } else {
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
function getOptions(args: string[], defs: ArgueTS.IOptionDef[] = []): ArgueTS.ICLIOptionObj {
    const reg1: RegExp = new RegExp(/\-\-?(\w+)/);
    const res: ArgueTS.ICLIOptionObj = {};
    let i: number = args.findIndex((e) => reg1.test(e));
    while (i !== -1) {
        const defI: number = defs.findIndex(
            (e) => `--${e.name}` === args[i] || `-${e.alias}` === args[i],
        );
        if (defI !== -1) {
            if (defI > 0) {
                defs.splice(defI, 1);
            }
            const def: ArgueTS.IOptionDef = defs[defI];
            if (res[def.name] === undefined) {
                if (def.switch) {
                    args.splice(i, 1);
                    res[def.name] = true;
                } else {
                    if (args[i + 1] !== undefined) {
                        let val: any = args[i + 1];
                        switch (def.type) {
                            case "boolean":
                                if (val === "true") {
                                    val = true;
                                } else {
                                    val = false;
                                }
                                break;
                            case "json":
                                try {
                                    val = JSON.parse(val);
                                } catch (e) {
                                    val = null;
                                }
                                break;
                            case "string":
                                val = val;
                                break;
                            case "number":
                                if (!isNaN(val)) {
                                    val = Number(val);
                                } else {
                                    val = 0;
                                }
                                break;
                            default:

                                break;
                        }
                        res[def.name] = val;
                        args.splice(i, 2);
                    } else {
                        res[def.name] = null;
                        args.splice(i, 1);
                    }
                }
            } else {
                if (def.switch) {
                    args.splice(i, 1);
                } else {
                    args.splice(i, 2);
                }
            }
        }
        i = args.findIndex((e) => reg1.test(e));
    }
    // Add in default values.
    for (const def of defs) {
        if (def.defaultValue !== undefined) {
            res[def.name] = def.defaultValue;
        }
    }
    return res;
}

/**
 * Returns the processed arguments array and an object containing the options parsed.
 * @param {string[]} args Arguments array. Default: process.argv.slice(2)
 * @param {ArgueTS.IOptionDef[]} defs Option definition array. Default: undefined.
 */
function ArgueTS(args: string[] = process.argv.slice(2), defs?: ArgueTS.IOptionDef[]): ArgueTS.IArguments {
    args = getEnclosed(args);
    const options: ArgueTS.ICLIOptionObj = getOptions(args, defs);
    return {
        args,
        options,
    };
}

namespace ArgueTS {
    /**
     * ArgueTS Instance Options.
     */
    export interface IArgueTSOptions {
        /**
         * Whether or not to filter out options that were not passed in the definitions array.
         */
        removeUndefined?: boolean;
    }
    /**
     * Defines a command-line option.
     */
    export interface IOptionDef {
        /**
         * The name of the option. Parsed as --name
         */
        name: string;
        /**
         * An alias for the option name. Parsed as -n
         */
        alias?: string;
        /**
         * The type of this option.
         * When parsed, it will return the value as this type.
         */
        type: "number" | "string" | "boolean" | "json";
        /**
         * Default value of this option.
         */
        defaultValue?: any;
        /**
         * Whether or not this option is a switch and takes no argument.
         */
        switch?: boolean;
    }
    export interface ICLIOptionObj {
        [key: string]: any;
    }
    /**
     * A parsed command-line option.
     */
    export interface ICLIOption {
        /**
         * The name of the option.
         */
        name: string;
        /**
         * The value parsed.
         */
        value: any;
    }

    /**
     * An object containing the final argument array and the parsed options.
     */
    export interface IArguments {
        /**
         * Argument array.
         */
        args: string[];
        /**
         * Array or object of parsed options.
         */
        options: ICLIOptionObj;
    }
}

export = ArgueTS;
