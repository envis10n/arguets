# ArgueTS
TypeScript arguments parser.

  
  
## Installation (lib)
`npm i arguets` or `yarn add arguets`

### (for dev)
- Clone the repo.
- Run `yarn` or `npm i`

## Usage
[Docs](https://envis10n.github.io/arguets/)


Example:
```ts
// TypeScript
import ArgueTS, { IOptionDef, IArguments } from "arguets";
const test: string[] = "test 1 2 3 --test OK".split(" ");
const testOpt: IOptionDef = {
	name: "test",
	alias: "t",
	type: "string",
};
const result: IArguments = ArgueTS(test, [testOpt]);
/*
	Result:
	{
		"args": ["test", "1", "2", "3"],
		"options": [{"name":"test", value: "OK"}]
	}
*/
```

```js
// JavaScript
const ArgueTS = require("arguets");
const test = "test 1 2 3 --test OK".split(" ");
const testOpt = {
	name: "test",
	alias: "t",
	type: "string"
};
const result = ArgueTS(test, [testOpt]);
/*
	Result:
	{
		"args": ["test", "1", "2", "3"],
		"options": [{"name":"test", value: "OK"}]
	}
*/
```