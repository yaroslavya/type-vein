import { Criterion } from "./criterion";
import { SetCriterion } from "./set-criterion";
import { Property } from "../property";
import { Primitive, Unbox } from "../lang";
import { Attribute } from "../attribute";

export interface InstanceCriteria {
    [k: string]: Criterion[] | SetCriterion[] | InstanceCriteria[];
}

export type InstanceCriteriaForType<T> = {
    [K in Property.Keys<T>]?
    : T[K] extends Property & { value: Primitive; } & Attribute.IsIterable ? SetCriterion[]
    : T[K] extends Property & { value: Primitive; } ? Criterion[]
    : T[K] extends Property ? InstanceCriteriaForType<Unbox<T[K]["value"]>>[]
    : never;
};
