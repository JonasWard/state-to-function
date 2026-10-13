import { OP_LABEL, OP_SYMBOL, OPS } from '../../model/operators';

export const operatorOptions = OPS.map((op) => ({ key: op, label: OP_SYMBOL[op], ariaLabel: OP_LABEL[op] }));
