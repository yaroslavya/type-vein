import { Primitive } from "./lang";
import { Type } from "./type";
import { Selection } from "./selection";
import { PropertyBuilder } from "./property-builder";

export interface Property<K extends string = string, V = any, P = V extends Primitive ? true : false> {
    key: K;
    value: V;
    primitive: P;
}

/**
 * Takes a property P and exchanges its value with what is provided for V.
 */
// export type ReplacePropertyValue<P extends Property, V> = Omit<P, "value"> & { value: V };
export type ReplacePropertyValue<P, V> = Omit<P, "value"> & { value: V };

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

export function propertiesOf<T extends Type | Selection>(type: T, predicate: (p: Property) => boolean = () => true): Record<string, Property> {
    let fields: Record<string, Property> = {};

    for (let k in type) {
        let candidate = type[k];

        if (Property.is(candidate) && predicate(candidate)) {
            fields[k] = candidate;
        }
    }

    return fields;
}

export module Property {
    export type Primitive<K extends string = string, V = any> = Property<K, V, true>;
    export type Complex<K extends string = string, V = any> = Property<K, V, false>;

    export function is(x?: any): x is Property {
        x = x || {};

        return typeof ((x as Property).key) === "string" && (x as Property).value != null;
    }

    export function create<K extends string, V, P extends Property<K, V> = Property<K, V>>(key: K, value: V, b: (builder: PropertyBuilder<K, V>) => PropertyBuilder<K, V, P> = p => p as any): P {
        return b(new PropertyBuilder(key, value)).build();
    }

    /**
     * [note] commented it out for now due to premature user experience optimisation.
     * for now i'll just always call loadable() when defining a property.
     */
    // export function define<K extends string, V, P = Property<K, V>>(key: K, value: V): P & IsLoadable;
    // export function define<K extends string, V, P extends Property<K, V> = Property<K, V>>(key: K, value: V, b: (builder: PropertyBuilder<K, V>) => PropertyBuilder<K, V, P>): P extends IsLoadable<true, any, any> ? P : P & IsLoadable;

    // export function define(...args: any[]): any {
    //     let key = args[0] as string;
    //     let value = args[1];

    //     if (args.length === 2) {
    //         return new PropertyBuilder(key, value).loadable().build();
    //     } else {
    //         return args[2](new PropertyBuilder(key, value).loadable()).build();
    //     }
    // }
}
