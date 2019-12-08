import { Class } from "./lang";

/**
 * The symbol that points to the type metadata.
 */
export const SourceTypeSymbol: unique symbol = Symbol();

/**
 * The contract each entity class defined by you has to fulfill.
 * 
 * It requires your entity class to include the metadata that is required for type-vein to properly
 * pick up your defined type. The metadata has to be stored at the unique symbol SourceTypeSymbol, and
 * can be easily implemented via SourceType.create():
 * ```typescript
 * class MyEntityType {
 *    [SourceTypeSymbol] = SourceType.create(MyEntityType);
 * }
 * ```
 * 
 * For more information about what the metadata is used for, check out the comments @ SourceType.Metadata.
 * 
 */
export interface SourceType<T extends Class = Class> {
    [SourceTypeSymbol]: SourceType.Metadata<T>;
}

export module SourceType {
    /**
     * Checks if a given thing is a SourceType.
     */
    export function is(x?: any): x is SourceType {
        return ((x || {}) as any as SourceType)[SourceTypeSymbol]?.class instanceof Function;
    }

    /**
     * The metadata of a user-defined type of entity (a SourceType). It contains a reference to the class that produces the
     * entity type when instantiated. The class reference is also used to uniquely identify a type.
     * 
     * Any part of type-vein that relies on fetching global data for a specific type of entity will
     * use the class reference to look it up.
     */
    export interface Metadata<T extends Class = Class> {
        class: T;
    }

    export function createMetadata<T extends Class = Class>(type: T): Metadata<T> {
        return {
            class: type
        };
    }
}
