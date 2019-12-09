export interface IntersectSetCriterion {
    op: "intersect";
    values: Set<boolean | number | string | null>;
}
