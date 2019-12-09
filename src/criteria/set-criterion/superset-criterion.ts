export interface SupersetSetCriterion {
    op: "superset";
    values: Set<boolean | number | string | null>;
}
