import { Primitive, Unbox } from "./lang";
import { Property, ReplacePropertyValue, PropertyKeys, OptionalPropertyKeys, RequiredPropertyKeys } from "./property";
import { Type } from "./type";
import { Selection } from "./selection";

/**
 * A property of a Selection that can be undefined.
 */
export type SelectedOptionalProperty<P extends Property | undefined, X = Property>
    = Exclude<P, undefined>["value"] extends Primitive ? P | undefined
    : ReplacePropertyValue<Exclude<P, undefined>, Select<Unbox<Exclude<P, undefined>["value"]>, X>> | undefined;

/**
 * A property of a selection that is defined.
 */
export type SelectedRequiredProperty<P extends Property, X = Property>
    = P["value"] extends Primitive ? P
    : ReplacePropertyValue<P, Select<Unbox<P["value"]>, X>>;

export type SelectOptionalProperties<T extends Type, P = Property> = {
    [K in OptionalPropertyKeys<T, P>]: SelectedOptionalProperty<T[K], P>;
};

export type SelectRequiredProperties<T extends Type, P = Property> = {
    [K in RequiredPropertyKeys<T, P>]: SelectedRequiredProperty<T[K], P>
};

export type Select<T extends Type, P = Property>
    = Selection<T>
    & SelectOptionalProperties<T, P>
    & SelectRequiredProperties<T, P>;


export type AnySelectionProperty<P extends Property>
    = P["value"] extends Primitive ? P | undefined
    : ReplacePropertyValue<P, AnySelection<Unbox<P["value"]>>> | undefined;

/**
* A type where any of its properties and those of expandable types can be undefined.
*/
export type AnySelection<T extends Type>
    = Selection<T>
    & {
        [K in PropertyKeys<T>]: AnySelectionProperty<T[K]>;
    };
