import { Property, ReplacePropertyValue, PropertyKeys } from "./property";
import { Primitive, Unbox } from "./lang";
import { Type } from "./type";
import { Selection } from "./selection";

/**
 * [todo] maybe rename to Context.Key and rename ContextValue to Context 
 */
export type Context
    = "creatable"
    | "loadable"
    | "patchable";

export interface ContextValue<N extends boolean = false, V extends boolean = false> {
    /**
     * If the value of this property in this context can be set to null.
     */
    nullable: N;

    /**
     * If this property is required in this context.
     */
    voidable: V;
}

export type HasContext<C extends Context, N extends boolean = any, V extends boolean = any> = Record<C, ContextValue<N, V>>;

export type IsCreatable<N extends boolean = false, V extends boolean = false>
    = HasContext<"creatable", N, V>;

export type IsLoadable<N extends boolean = false, V extends boolean = false>
    = HasContext<"loadable", N, V>;

export type IsPatchable<N extends boolean = false, V extends boolean = false>
    = HasContext<"patchable", N, V>;

export type ChangeContextVoidable<P extends HasContext<C, any, any>, C extends Context, B extends boolean>
    = Omit<P, C> & HasContext<C, P[C]["nullable"], B>;

export function setContext<T extends object, C extends Context, F extends (keyof ContextValue)[] = never[]>(property: T, context: C, flags?: F)
    : HasContext<C, IncludesContextValue<F, "nullable">, IncludesContextValue<F, "voidable">> {
    let ctx: ContextValue<any, any> = {
        nullable: !!flags?.includes("nullable"),
        voidable: !!flags?.includes("voidable")
    };

    (property as any)[context] = ctx;

    return property as any;
}

export function hasContext<C extends Context>(property: any, context: C): property is HasContext<C> {
    return typeof (property?.[context]) === "object";
}

export type IncludesContextValue<T extends string[], A extends keyof ContextValue> = undefined extends T ? false : A extends T[number] ? true : false;

/**
 * [note] it is important to manually type out all the combinations
 * "nullable" and "voidable" in order to simplify the type hinting
 * provided by TypeScript when assigning values to instances
 */
export type WidenValueForContext<P, C extends Context, V>
    = (
        P extends HasContext<C, true, true> ? V | null | undefined
        : P extends HasContext<C, true, false> ? V | null
        : P extends HasContext<C, false, true> ? V | undefined
        : V
    );

export type PickedVoidableProperty<P extends Property & HasContext<C, any, any>, C extends Context>
    = P["value"] extends Primitive ? P[C]["voidable"] extends true ? ChangeContextVoidable<P, C, boolean> : P
    : ReplacePropertyValue<P[C]["voidable"] extends true ? ChangeContextVoidable<P, C, boolean> : P, PickedVoidables<Unbox<P["value"]>, C>>;

/**
* A type where any of its properties and those of expandable types can be undefined.
*/
export type PickedVoidables<T extends Type, C extends Context>
    = Selection<T>
    & {
        [K in PropertyKeys<T, HasContext<C, any, false>>]: PickedVoidableProperty<T[K], C>;
    }
    & {
        [K in PropertyKeys<T, HasContext<C, any, true>>]?: PickedVoidableProperty<T[K], C>;
    };
