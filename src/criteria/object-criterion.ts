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
    [k: string]: ObjectCriterion.PropertyCriteria;
}

export type ObjectCriteria = ObjectCriterion[];

export module ObjectCriterion {
    export type PropertyCriteria = ValueCriteria | ValuesCriteria | ObjectCriteria;

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
            // return b;
        }

        let reducedPropertyCriteria: { key: string; reduced: ObjectCriterion.PropertyCriteria; } | undefined;

        for (let key in a) {
            let criteriaB = b[key];

            if(criteriaB === void 0) {
                continue;
            }

            let criteriaA = a[key];
            let reduced: ObjectCriterion.PropertyCriteria | null;

            if (ValueCriteria.is(criteriaA)) {
                if (ValueCriteria.is(criteriaB)) {
                    reduced = ValueCriteria.reduce(criteriaA, criteriaB);
                } else {
                    throw new Error("trying to reduce two criteria of different types");
                }
            } else {
                throw new Error("currently only ValueCriteria are supported @ ObjectCriterion.reduce()");
            }

            if (reduced === criteriaB || (reduced !== null && reducedPropertyCriteria !== void 0)) {
                return b;
            } else if (reduced !== null && reducedPropertyCriteria === void 0) {
                reducedPropertyCriteria = { key, reduced };
            }
        }

        if (reducedPropertyCriteria === void 0) {
            let numCriteriaA = Object.keys(a).length;
            let numCriteriaB = Object.keys(b).length;

            if (numCriteriaA == numCriteriaB + 1) {
                for (let key in a) {
                    let criteriaA = a[key];
                    let criteriaB = b[key];

                    if (criteriaB !== void 0) {
                        continue;
                    }

                    if (!ValueCriteria.is(criteriaA) || criteriaA.length > 1) {
                        throw new Error("currently only ValueCriteria with one element are supported for inversion");
                    }

                    return {
                        ...b,
                        [key]: [ValueCriterion.invert(criteriaA[0])]
                    };
                }

                return b;
            } else if (numCriteriaA > numCriteriaB) {
                // [todo] support this if possibru
                return b;
            } else {
                return null;
            }
        } else {
            return {
                ...b,
                [reducedPropertyCriteria.key]: reducedPropertyCriteria.reduced
            };
        }
    }
}
