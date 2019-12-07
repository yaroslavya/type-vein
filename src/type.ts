import { Class } from "./lang";

/**
 * The symbol that points to the type metadata.
 */
export const TypeSymbol: unique symbol = Symbol();

/**
 * The contract each entity class defined by you has to fulfill.
 * 
 * It requires your entity class to include the metadata that is required for type-vein to properly
 * pick up your defined type. The metadata has to be stored at the unique symbol TypeSymbol, which
 * can be easily implemented via Type.createMetadata():
 * ```typescript
 * class MyEntityType {
 *    [TypeSymbol] = Type.createMetadata(MyEntityType);
 * }
 * ```
 * 
 * For more information about what the metadata is used for, check out the comments @ Type.Metadata.
 * 
 */
export interface Type<T extends Class = Class> {
    [TypeSymbol]: Type.Metadata<T>;
}

export module Type {
    export function is(x?: any): x is Type {
        return ((x || {}) as any as Type)[TypeSymbol]?.class instanceof Function;
    }

    /**
     * The metadata of a user-defined type of entity. It contains a reference to the class that produces the
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
