import { Type } from "./type";

export const SelectionSymbol: unique symbol = Symbol();

export interface Selection<T extends Type = Type> {
    [SelectionSymbol]: Selection.Metadata<T>;
}

export module Selection {
    export function is(x?: any): x is Selection {
        return Type.is(((x || {}) as any as Selection)[SelectionSymbol]?.type);
    }

    export interface Metadata<T extends Type = Type> {
        type: T;
    }

    export function createMetadata<T extends Type = Type>(source: T): Metadata<T> {
        return {
            type: source
        };
    }
}
