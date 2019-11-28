import { Primitive, Unbox } from "./lang";
import { Property, ReplacePropertyValue, PropertyKeys } from "./property";
import { Type } from "./type";
import { Selection } from "./selection";

/**
 * A property of a selection.
 */
export type SelectedProperty<P extends Property, X = Property>
    = P["value"] extends Primitive ? P
    : ReplacePropertyValue<P, Select<Unbox<P["value"]>, X>>;

export type SelectedProperties<T extends Type, P = Property> = {
    [K in PropertyKeys<T, P>]: SelectedProperty<T[K], P>;
};

/**
 * For a given type, take all properties that extend P. This is applied recursively onto expanded types.
 */
export type Select<T extends Type, P = Property>
    = Selection<T>
    & SelectedProperties<T, P>;
