import { array, enumArray, enumeration, fixed, int, object, reference, schema, template, union } from 'densing';
import type { DenseField, Template } from 'densing';
import { MAX_TEXT_LENGTH, NAME_CHARS, NUMBER_CHARS, SUBSCRIPT_CHARS, SYMBOL_CHARS } from './charsets';
import { FLOAT_MAX, FLOAT_MIN, FLOAT_PRECISION, INT_MAX, INT_MIN, MAX_INPUTS, MAX_METHODS } from './numeric';
import { OP_ARITY, OPS } from './operators';

export const DEFINITION_VERSION = 1;

const text = (name: string, chars: string[]) =>
  enumArray(name, enumeration(`${name}Char`, chars), 0, MAX_TEXT_LENGTH);

const labelFields = (): DenseField[] => [
  enumeration('symbol', SYMBOL_CHARS),
  text('subscript', SUBSCRIPT_CHARS),
  text('name', NAME_CHARS)
];

const float = (name: string) => fixed(name, FLOAT_MIN, FLOAT_MAX, FLOAT_PRECISION, 0);
const integer = (name: string) => int(name, INT_MIN, INT_MAX, 0);

const operand: Template = template(
  union('operand', enumeration('type', ['hardcoded', 'numericInput', 'methodOutput', 'method']), {
    hardcoded: [text('value', NUMBER_CHARS)],
    numericInput: [int('index', 0, MAX_INPUTS - 1)],
    methodOutput: [int('index', 0, MAX_METHODS - 1)],
    method: [reference('method', () => expr)]
  })
);

const expr: Template = template(
  union(
    'expr',
    enumeration('op', [...OPS]),
    Object.fromEntries(
      OPS.map((op) => [op, [array('values', OP_ARITY[op].min, OP_ARITY[op].max, reference('value', operand))]])
    )
  )
);

export const DEFINITION_SCHEMA = schema(
  int('version', 0, 255, DEFINITION_VERSION),
  array(
    'inputs',
    1,
    MAX_INPUTS,
    object(
      'input',
      ...labelFields(),
      union('kind', enumeration('type', ['constant', 'integer', 'float']), {
        constant: [text('value', NUMBER_CHARS)],
        integer: [integer('min'), integer('value'), integer('max')],
        float: [float('min'), float('value'), float('max')]
      })
    )
  ),
  array('methods', 0, MAX_METHODS, object('methodDef', ...labelFields(), reference('method', expr)))
);
