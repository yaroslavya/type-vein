export interface LessEqualsCriterion {
    op: "<=";
    value: number | string;
}

export module LessEqualsCriterion {
    export function create<V extends LessEqualsCriterion["value"]>(value: V): LessEqualsCriterion {
        return { op: "<=", value: value };
    }
}
