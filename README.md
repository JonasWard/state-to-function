# State-to-Function

Compose spreadsheet-like formulas, use them as a small calculator and keep everything in the URL — no backend.

## Usage

1. **Definitions** — define inputs (constant, integer or decimal) and methods built from operations on inputs,
   earlier results, constants and nested expressions.
2. **Applet** — set the variable inputs and read the results; export them as CSV or as a PDF with a QR code.

## Logic

The URL hash is `#/<view>/<definition>[/<applet values>]`:

1. the definition (inputs, methods and their labels), encoded with [densing](https://www.npmjs.com/package/densing)
   against the schema in `src/model/schema.ts`. Its first byte is a schema version.
2. the applet values, encoded against a schema derived from the definition (`src/model/appletSchema.ts`); omitted
   while every input is at its default.

Links from before the densing switch (url-safe-bitpacking, version byte 0) are decoded by `src/legacy`, which is
loaded only when such a link is opened, and rewritten in the new format.

## Development

```sh
bun install
bun run dev        # http://localhost:3022/
bun run lint && bun run typecheck && bun run test
bun run build
bun run e2e        # Playwright against the production build
```

## Deployment

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests, build and the Playwright tests on every
push and pull request. Pushes to `main` that pass are deployed to GitHub Pages (Settings → Pages → Source:
"GitHub Actions").

# storing the algorithm

Conceptually one needs to consider 2 distict parent types

1. Methods - we'll consider 'if', >, <, =, !=, \*, /, +, -, ^
2. Numeric Inputs - which is either a hardcoded value or a reference to an input

## Methods

Typically inputs of a method can be either a method or a float input (all except for the 'if' method for now)
Every method resolves to one single value (bool or float), but can have a variable amount of inputs.
Most methods will have two inputs, though some will have only one or a variable amount

### input types

1. Numeric Input - Reference to shared value - shortened to I
2. Float Resolving Method - shortened to Mf
3. Boolean Resolving Method - shortened to Mb

### Method types

| Method | Resolves | I#    | Inputs      |        |        | Description                                                  |
| ------ | -------- | ----- | ----------- | ------ | ------ | ------------------------------------------------------------ |
| if     | float    | 3     | Mb          | I / Mf | I / Mf | if input 1 is true, return input 2, else return input 3      |
| >      | bool     | 2     | I / Mf      | I / Mf |        | if input 1 is larger than input 2, return true, else false   |
| <      | bool     | 2     | I / Mf      | I / Mf |        | if input 1 is smaller than input 2, return true, else false  |
| =      | bool     | 2     | I / Mf      | I / Mf |        | if input 1 is equal, return input 2, else return input 3     |
| !=     | bool     | 2     | I / Mf      | I / Mf |        | if input 1 is not equal, return input 2, else return input 3 |
| \*     | float    | 2...8 | (I / Mf) [] |        |        | multiply all values with one another                         |
| /      | float    | 2     | I / Mf      | I / Mf |        | divide input 1 by input 2                                    |
| +      | float    | 2...8 | (I / Mf) [] |        |        | add all values with one another                              |
| -      | float    | 2     | I / Mf      | I / Mf |        | subtract input 2 from input 1                                |
| ^      | float    | 2     | I / Mf      | I / Mf |        | raise input 1 to power input 2                               |
