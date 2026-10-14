import { Label } from '../../model/types';

/** What an operand may reference: all inputs and the methods defined before the one being edited. */
export interface ReferenceContext {
  inputs: Label[];
  methods: Label[];
  /** the method being edited and those after it; only used to explain why they can't be referenced */
  later?: Label[];
}
