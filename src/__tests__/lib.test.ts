import arguets from "../lib";

test("arguets", () => {
    const options: arguets.IOptionDef[] = [
        {name: "test", alias: "t", type: "boolean"},
        {name: "file", alias: "f", type: "string"},
    ];
    const args: string[] = "testing args parsing -t true".split(" ");
    const parsed: arguets.IArguments = arguets(args, options);
    expect(parsed.options.test).toBe(true);
    expect(parsed.options.file).toBe(undefined);
    console.log(parsed);
});