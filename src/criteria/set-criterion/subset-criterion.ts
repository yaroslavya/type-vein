export interface SubsetSetCriterion {
    op: "subset";
    values: Set<boolean | number | string | null>;
}
