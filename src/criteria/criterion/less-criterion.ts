export interface LessCriterion {
    op: "<";
    value: number | string;
}

export module LessCriterion {
    export function create<V extends LessCriterion["value"]>(value: V): LessCriterion {
        return { op: "<", value: value };
    }
}
