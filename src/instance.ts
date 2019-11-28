import { Primitive, Unbox } from "./lang";
import { Property, PropertyKeys, PropertyAliased } from "./property";
import { IsIterable } from "./attribute";
import { Context, HasContext, WidenValueForContext } from "./context";

export type BoxPropertyValue<P, V> = P extends IsIterable ? V[] : V;

export type InstancedValueOfProperty<P extends Property | undefined, C extends Context, V = Exclude<P, undefined>["value"]>
    = undefined extends P
    ? (V extends Primitive ? BoxPropertyValue<Exclude<P, undefined>, ReturnType<V>> : BoxPropertyValue<Exclude<P, undefined>, Instance<Unbox<V>, C>>) | undefined
    : V extends Primitive ? BoxPropertyValue<P, ReturnType<V>> : BoxPropertyValue<P, Instance<Unbox<V>, C>>;

export type Instance<T, C extends Context> = {
    [K in PropertyKeys<T, HasContext<C, any, any>>]: WidenValueForContext<T[K], C, InstancedValueOfProperty<T[K], C>>;
};

export type AliasedInstancedValueOfProperty<P extends Property, C extends Context>
    = P["value"] extends Primitive ? BoxPropertyValue<P, ReturnType<P["value"]>>
    : BoxPropertyValue<P, AliasedInstance<Unbox<P["value"]>, C>>;

export type AliasedInstance<T, C extends Context> = {
    [K in PropertyKeys<T, HasContext<C, any, any>, true>]: WidenValueForContext<PropertyAliased<T, K>, C, AliasedInstancedValueOfProperty<PropertyAliased<T, K>, C>>;
};
