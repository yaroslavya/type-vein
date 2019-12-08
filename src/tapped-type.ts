import { SourceType } from "./source-type";

export const TappedTypeSymbol: unique symbol = Symbol();

/**
 * A TappedType is a SourceType in an altered form. Its metadata contains a reference to the SourceType it was tapped from.
 */
export interface TappedType<T extends SourceType = SourceType> {
    [TappedTypeSymbol]: TappedType.Metadata<T>;
}

export module TappedType {
    /**
     * Checks if a given thing is a TappedType.
     */
    export function is(x?: any): x is TappedType {
        return SourceType.is(((x || {}) as any as TappedType)[TappedTypeSymbol]?.source);
    }

    export interface Metadata<T extends SourceType = SourceType> {
        source: T;
    }

    export function createMetadata<T extends SourceType = SourceType>(source: T): Metadata<T> {
        return {
            source
        };
    }
}
