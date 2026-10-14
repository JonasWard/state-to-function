export const ARRAY_OPS = ['addition', 'multiplication'] as const;
export const PAIR_OPS = ['subtraction', 'division', 'power'] as const;
export const CONDITIONAL_OPS = ['smallerThan', 'greaterThan', 'equal'] as const;
export const OPS = [...ARRAY_OPS, ...PAIR_OPS, ...CONDITIONAL_OPS] as const;

export type Op = (typeof OPS)[number];

export const OP_ARITY: Record<Op, { min: number; max: number }> = {
  addition: { min: 2, max: 8 },
  multiplication: { min: 2, max: 8 },
  subtraction: { min: 2, max: 2 },
  division: { min: 2, max: 2 },
  power: { min: 2, max: 2 },
  smallerThan: { min: 4, max: 4 },
  greaterThan: { min: 4, max: 4 },
  equal: { min: 4, max: 4 }
};

export const OP_SYMBOL: Record<Op, string> = {
  addition: '+',
  multiplication: '×',
  subtraction: '−',
  division: '÷',
  power: '^',
  smallerThan: '<',
  greaterThan: '>',
  equal: '='
};

export const OP_LABEL: Record<Op, string> = {
  addition: 'Add',
  multiplication: 'Multiply',
  subtraction: 'Subtract',
  division: 'Divide',
  power: 'Power',
  smallerThan: 'If smaller than',
  greaterThan: 'If greater than',
  equal: 'If equal'
};

export const isConditional = (op: Op) => (CONDITIONAL_OPS as readonly Op[]).includes(op);
