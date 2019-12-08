import { Criterion } from "./criterion";

export interface NotEqualsCriterion {
    op: "!=";
    value: boolean | number | string | null;
}

export module NotEqualsCriterion {
    export function create<V extends NotEqualsCriterion["value"]>(value: V): NotEqualsCriterion {
        return { op: "!=", value: value };
    }

    /**
     * [todo] unfinished - will do later since it is one of the less
     * important criteria.
     */
    export function reduce(a: NotEqualsCriterion, b: Criterion): Criterion | null {
        switch (b.op) {
            case "!=": return a.value === b.value ? null : b;
            case "==": return a.value === b.value ? b : null;
            default: return b;
        }
    }
}
