import { Criterion } from "./criterion";
import { SetCriterion } from "./set-criterion";
import { Property } from "../property";
import { Primitive, Unbox } from "../lang";
import { Attribute } from "../attribute";

export type PropertyCriterion
    = Criterion | SetCriterion | InstanceCriteria;

export type PropertyCriteria
    = Criterion[] | SetCriterion[] | InstanceCriteria[];

export module PropertyCriterion {
    export function areSameType<A extends PropertyCriterion>(a: A, b: any): b is A {
        if (typeof (a.op) === "string") {
            if (typeof (b.op) === "string") {
                return a.op === b.op;
            } else {
                return false;
            }
        } else {
            return typeof (b.op) !== "string";
        }
    }
}

export interface InstanceCriteria {
    [k: string]: Criterion[] | SetCriterion[] | InstanceCriteria[];
}

export module InstanceCriteria {
    export type ForType<T> = {
        [K in Property.Keys<T>]?
        : T[K] extends Property & { value: Primitive; } & Attribute.IsIterable ? SetCriterion[]
        : T[K] extends Property & { value: Primitive; } ? Criterion[]
        : T[K] extends Property ? InstanceCriteria.ForType<Unbox<T[K]["value"]>>[]
        : never;
    };

    export function reduce(a: InstanceCriteria, b: InstanceCriteria): InstanceCriteria | null {
        // if [a] has more criteria than [b] we can just return [b]
        if (Object.keys(a).length > Object.keys(b).length) {
            return b;
        }
        
        // if [a] has criteria on properties not found in [b] we can just return [b]
        for (let k in a) {
            if (b[k] === void 0) {
                return b;
            }
        }

        // otherwise, start reducing each criterion on a property
        for (let k in a) {
            // [todo] implement
        }

        return null;
    }
}
