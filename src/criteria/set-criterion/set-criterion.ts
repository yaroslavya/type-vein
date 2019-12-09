import { IntersectSetCriterion } from "./intersect-criterion";
import { SubsetSetCriterion } from "./subset-criterion";
import { SupersetSetCriterion } from "./superset-criterion";

export type SetCriterion
    = IntersectSetCriterion
    | SubsetSetCriterion
    | SupersetSetCriterion;
