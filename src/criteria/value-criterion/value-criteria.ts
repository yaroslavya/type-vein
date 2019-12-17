import { ValueCriterion } from "./value-criterion";

export type ValueCriteria = ValueCriterion[];

export module ValueCriteria {
    export function reduce(a: ValueCriteria, b: ValueCriteria): ValueCriteria | null {
        return {} as any;
    }
}