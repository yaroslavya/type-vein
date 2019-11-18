import { Primitive, Unbox } from "./lang";
import { Type } from "./type";
import { Selection } from "./selection";

export interface Property<K extends string = string, V = any, P = V extends Primitive ? true : false> {
    key: K;
    value: V;
    primitive: P;
}

export module Property {
    export function is(x?: any): x is Property {
        x = x || {};

        return typeof ((x as Property).key) === "string" && (x as Property).value != null;
    }
}
/**
 * Takes a property P and exchanges its value with what is provided for V.
 */
export type ReplacePropertyValue<P extends Property, V> = Omit<P, "value"> & { value: V };

/**
 * The keys in T that point to a Property optionally extending P and are possibly undefined.
 */
export type OptionalPropertyKeys<T, P = Property> = Exclude<({
    [K in keyof T]: undefined extends T[K] ? (T[K] extends (Property & P) | undefined ? K : never) : never;
})[keyof T], undefined>;

/**
 * The keys in T that point to a Property optionally extending P and are defined.
 */
export type RequiredPropertyKeys<T, P = Property> = Exclude<({
    [K in keyof T]: T[K] extends (Property & P) ? K : never;
})[keyof T], undefined>;

/**
 * The keys in T that point to a Property optionally extending P and are either undefined or defined.
 */
export type PropertyKeys<T, P = Property>
    = OptionalPropertyKeys<T, P>
    | RequiredPropertyKeys<T, P>;

export function propertiesOf<T extends Type | Selection>(type: T): Record<string, Property> {
    let fields: Record<string, Property> = {};

    for (let k in type) {
        let candidate = type[k];

        if (Property.is(candidate)) {
            fields[k] = candidate;
        }
    }

    return fields;
}
