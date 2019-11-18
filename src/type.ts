import { Class } from "./lang";

export const TypeSymbol: unique symbol = Symbol();

export interface Type<T extends Class = Class> {
    [TypeSymbol]: Type.Metadata<T>;
}

export module Type {
    export function is(x?: any): x is Type {
        return ((x || {}) as any as Type)[TypeSymbol]?.class instanceof Function;
    }

    export interface Metadata<T extends Class = Class> {
        class: T;
    }

    export function createMetadata<T extends Class = Class>(type: T): Metadata<T> {
        return {
            class: type
        };
    }
}
