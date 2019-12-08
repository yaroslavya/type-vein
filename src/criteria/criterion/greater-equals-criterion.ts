export interface GreaterEqualsCriterion {
    op: ">=";
    value: number | string;
}

export module GreaterEqualsCriterion {
    export function create<V extends GreaterEqualsCriterion["value"]>(value: V): GreaterEqualsCriterion {
        return { op: ">=", value: value };
    }
}
