import { MathSymbol } from '../../Components/math/MathSymbol';
import { symbolLabel } from '../../Components/math/symbolLabel';
import { Label } from '../../model/types';

/** Grid options for picking an input or an earlier method by its symbol. */
export const symbolOptions = (labels: Label[]) =>
  labels.map((l, i) => ({
    key: i,
    label: <MathSymbol symbol={l.symbol} subscript={l.subscript} size="sm" />,
    ariaLabel: `${symbolLabel(l.symbol, l.subscript)}${l.name ? `, ${l.name}` : ''}`
  }));
