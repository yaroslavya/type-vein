import { Property } from "./property";

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

export type HasContext<C extends Context, N extends boolean = false, V extends boolean = false> = Record<C, ContextValue<N, V>>;

export type IsCreatable<N extends boolean = false, V extends boolean = false>
    = HasContext<"creatable", N, V>;

export type IsLoadable<N extends boolean = false, V extends boolean = false>
    = HasContext<"loadable", N, V>;

export type IsPatchable<N extends boolean = false, V extends boolean = false>
    = HasContext<"patchable", N, V>;

// export type RemoveContextVoidable<P extends Property & HasContext<C, any, any>, C extends Context>
export type RemoveContextVoidable<P extends HasContext<C, any, any>, C extends Context>
    = Omit<P, C> & HasContext<C, P[C]["nullable"], false>;

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
 * "nullable" and "voidable" in order to improve the type hinting
 * provided by TypeScript when assigning values to instances
 */
export type WidenValueForContext<P, C extends Context, V>
    = (
        P extends HasContext<C, true, true> ? V | null | undefined
        : P extends HasContext<C, true, false> ? V | null
        : P extends HasContext<C, false, true> ? V | undefined
        : V
    );
