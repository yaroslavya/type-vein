import { Primitive, Unbox } from "./lang";
import { Property, PropertyKeys, PropertyAliased } from "./property";
import { IsIterable } from "./attribute";
import { Context, HasContext, WidenValueForContext } from "./context";

export type BoxPropertyValue<P, V> = P extends IsIterable ? V[] : V;

export type InstancedValueOfProperty<P extends Property, C extends Context, X>
    = P["value"] extends Primitive ? BoxPropertyValue<P, ReturnType<P["value"]>>
    : BoxPropertyValue<P, Instance<Unbox<P["value"]>, C, X>>;

export type Instance<T, C extends Context, P = Property> = {
    [K in PropertyKeys<T, HasContext<C, any, any> & P>]: WidenValueForContext<T[K], C, InstancedValueOfProperty<T[K], C, P>>;
};

export type AliasedInstancedValueOfProperty<P extends Property, C extends Context>
    = P["value"] extends Primitive ? BoxPropertyValue<P, ReturnType<P["value"]>>
    : BoxPropertyValue<P, AliasedInstance<Unbox<P["value"]>, C>>;

export type AliasedInstance<T, C extends Context> = {
    [K in PropertyKeys<T, HasContext<C, any, any>, true>]: WidenValueForContext<PropertyAliased<T, K>, C, AliasedInstancedValueOfProperty<PropertyAliased<T, K>, C>>;
};
