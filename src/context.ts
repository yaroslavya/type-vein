export type Context
    = "creatable"
    | "loadable"
    | "patchable";

/**
 * [todo] naming sucks
 */
export interface ContextValue<O extends boolean = false, N extends boolean = false, V extends boolean = false> {
    /**
     * If the property has to exist when in this state (support for OData $select on primitives).
     */
    omittable: O;

    /**
     * If the value of a property in this state can be set to null.
     */
    nullable: N;

    /**
     * If the value of a property in this state can be set to undefined.
     */
    voidable: V;
}

export type HasContext<C extends Context, O extends boolean = false, N extends boolean = false, V extends boolean = false> = Record<C, ContextValue<O, N, V>>;

export type IsCreatable<O extends boolean = false, N extends boolean = false, V extends boolean = false>
    = HasContext<"creatable", O, N, V>;

export type IsLoadable<O extends boolean = false, N extends boolean = false, V extends boolean = false>
    = HasContext<"loadable", O, N, V>;

export type IsPatchable<O extends boolean = false, N extends boolean = false, V extends boolean = false>
    = HasContext<"patchable", O, N, V>;

export function setContext<T extends object, C extends Context, F extends (keyof ContextValue)[] = never[]>(property: T, context: C, flags?: F)
    : HasContext<C, IncludesContextValue<F, "omittable">, IncludesContextValue<F, "nullable">, IncludesContextValue<F, "voidable">> {
    let ctx: ContextValue<any, any, any> = {
        nullable: !!flags?.includes("nullable"),
        omittable: !!flags?.includes("omittable"),
        voidable: !!flags?.includes("voidable")
    };

    (property as any)[context] = ctx;

    return property as any;
}

/**
 * [todo] better naming
 */
export type IncludesContextValue<T extends string[], A extends keyof ContextValue> = undefined extends T ? false : A extends T[number] ? true : false;

export type WidenValueForContext<P, C extends Context, V>
    = (
        P extends HasContext<C, any, true, true> ? V | null | undefined
        : P extends HasContext<C, any, true, false> ? V | null
        : P extends HasContext<C, any, false, true> ? V | undefined
        : V
    );
