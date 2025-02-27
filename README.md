# State-to-Function

Little applet that allows to compose a method and set state, both using URL bit packing :)

## Usage

first: compose - Navigate to the root and compose a method and define localisation for each of the strings
second: when done - Navigate to the input view and store the state

## Logic

this app has two states that need to be stored

1. the algorithm and its localisation
2. the exact value of the state for a specific calculation

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
