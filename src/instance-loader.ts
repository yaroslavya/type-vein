import { SourceType } from "./source-type";
import { Instance } from "./instance";
import { CriteriaForType } from "./criteria";
import { Context } from "./context";
import { TappedType } from "./tapped-type";
import { Property } from "./property";
import { Primitive, Unbox } from "./lang";

export interface InstanceLoader<T extends SourceType> {
    load(loadable: InstanceLoader.Loadable<T, "loadable">, criteria: CriteriaForType<T>[]): Map<string | number, Instance<T, "loadable">>;
}

export module InstanceLoader {
    type LoadableProperty<P extends Property & Context.Has<C>, C extends Context>
        = P["value"] extends Primitive ? P[C]["optional"] extends true ? Context.ChangeOptional<P, C, boolean> : P
        : Property.ReplaceValue<P[C]["optional"] extends true ? Context.ChangeOptional<P, C, boolean> : P, Loadable<Unbox<P["value"]>, C>>;

    export type Loadable<ST extends SourceType, CTX extends Context>
        = TappedType<ST>
        & {
            [K in Property.Keys<ST, Context.IsRequired<CTX>>]: LoadableProperty<ST[K], CTX>;
        }
        & {
            [K in Property.Keys<ST, Context.IsOptional<CTX>>]?: LoadableProperty<ST[K], CTX>;
        };
}
