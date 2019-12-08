export interface NotInCriterion {
    op: "not-in";
    values: Set<boolean | number | string | null>;
}

export module NotInCriterion {
    export function create<V extends boolean | number | string | null>(values: Iterable<V>): NotInCriterion {
        return { op: "not-in", values: new Set(values) };
    }
}