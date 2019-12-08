export interface GreaterCriterion {
    op: ">";
    value: number | string;
}

export module GreaterCriterion {
    export function create<V extends GreaterCriterion["value"]>(value: V): GreaterCriterion {
        return { op: ">", value: value };
    }
}
