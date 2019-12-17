import { IntersectValuesCriterion } from "./intersect-values-criterion";
import { SubsetValuesCriterion } from "./subset-values-criterion";
import { SupersetValuesCriterion } from "./superset-values-criterion";

export type ValuesCriterion
    = IntersectValuesCriterion
    | SubsetValuesCriterion
    | SupersetValuesCriterion;
