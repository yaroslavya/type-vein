import { ValueCriterion, ValueCriteria } from "./value-criterion";
import { ValuesCriterion, ValuesCriteria } from "./values-criterion";
import { Property } from "../property";
import { Primitive, Unbox } from "../lang";
import { Attribute } from "../attribute";

export type PropertyCriterion
    = ValueCriterion | ValuesCriterion | ObjectCriterion;

export type PropertyCriteria
    = ValueCriterion[] | ValuesCriterion[] | ObjectCriterion[];

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

export interface ObjectCriterion {
    [k: string]: ValueCriteria | ValuesCriteria | ObjectCriteria;
}

export type ObjectCriteria = ObjectCriterion[];

export module ObjectCriterion {
    export type ForType<T> = {
        [K in Property.Keys<T>]?
        : T[K] extends Property & { value: Primitive; } & Attribute.IsIterable ? ValuesCriterion[]
        : T[K] extends Property & { value: Primitive; } ? ValueCriterion[]
        : T[K] extends Property ? ObjectCriterion.ForType<Unbox<T[K]["value"]>>[]
        : never;
    };

    export function reduce(a: ObjectCriterion, b: ObjectCriterion): ObjectCriterion | null {
        // if [a] has more criteria than [b] we can just return [b]
        if (Object.keys(a).length > Object.keys(b).length) {
            return b;
        }

        let reducedValueCriteria : Record<string, ValueCriteria> = {};
        let valueCriteriaA = ValueCriteria.pick(a);
        let valueCriteriab = ValueCriteria.pick(b);

        let foo = reduceValueCriteria(ValueCriteria.pick(a), ValueCriteria.pick(b));

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

    export function reduceValueCriteria(a: Record<string, ValueCriteria>, b: Record<string, ValueCriteria>): Record<string, ValueCriteria> | null {
        let reduced: Record<string, ValueCriteria> = {};
        let didReduce = false;

        for (let k in a) {
            let reducedValueCriteria = ValueCriteria.reduce(a[k], b[k]);

            if (reducedValueCriteria !== null) {
                reduced[k] = reducedValueCriteria;
            }

            if (reducedValueCriteria !== b[k] && !didReduce) {
                didReduce = true;
            }
        }

        return didReduce
            ? Object.keys(reduced).length > 0 ? reduced : null
            : b;
    }
}
