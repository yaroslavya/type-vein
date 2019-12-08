import { Primitive, Unbox } from "./lang";
import { Property } from "./property";
import { Attribute } from "./attribute";
import { Context } from "./context";

export type BoxPropertyValue<P, V> = P extends Attribute.IsIterable ? V[] : V;

export type InstancedValueOfProperty<P extends Property, CTX extends Context, X>
    = P["value"] extends Primitive
    ? BoxPropertyValue<P, ReturnType<P["value"]>>
    : BoxPropertyValue<P, Instance<Unbox<P["value"]>, CTX, X>>;

export type Instance<T, CTX extends Context, P = Property>
    = {
        [K in Property.Keys<T, Context.IsRequired<CTX> & P>]: Context.WidenValue<T[K], CTX, InstancedValueOfProperty<T[K], CTX, P>>;
    } & {
        [K in Property.Keys<T, Context.IsOptional<CTX> & P>]?: Context.WidenValue<T[K], CTX, InstancedValueOfProperty<T[K], CTX, P>>;
    };

export type AliasedInstancedValueOfProperty<P extends Property, CTX extends Context>
    = P["value"] extends Primitive ? BoxPropertyValue<P, ReturnType<P["value"]>>
    : BoxPropertyValue<P, AliasedInstance<Unbox<P["value"]>, CTX>>;

export type AliasedInstance<T, CTX extends Context>
    = {
        [K in Property.Aliases<T, Context.IsRequired<CTX>>]: Context.WidenValue<Property.Aliased<T, K>, CTX, AliasedInstancedValueOfProperty<Property.Aliased<T, K>, CTX>>;
    } & {
        [K in Property.Aliases<T, Context.IsOptional<CTX>>]?: Context.WidenValue<Property.Aliased<T, K>, CTX, AliasedInstancedValueOfProperty<Property.Aliased<T, K>, CTX>>;
    };
