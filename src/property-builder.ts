import { Property } from "./property";
import { Primitive } from "./lang";
import { IsLoadable, ContextValue, IncludesContextValue, IsCreatable, IsPatchable, setContext } from "./context";
import { IsFilterable, IsIterable, IsUnique, IsIndexable, setAttribute, Attributes } from "./attribute";

export class PropertyBuilder<K extends string, V, A extends string = K, P extends Property<K, V, A> = Property<K, V, A>> {
    constructor(key: K, value: V, alias: A) {
        let primitive = Primitive.is(value) as any;

        let property: Property<K, V, A> = {
            key, value, primitive, alias
        };

        this._property = property as any;
    }

    readonly _property: P;

    filterable(): PropertyBuilder<K, V, A, P & IsFilterable> {
        setAttribute(this._property, "filterable", true);
        return this as any;
    }

    indexable(): PropertyBuilder<K, V, A, P & IsIndexable> {
        setAttribute(this._property, "indexable", true);
        return this as any;
    }

    iterable(args?: Attributes["iterable"]): PropertyBuilder<K, V, A, P & IsIterable> {
        setAttribute(this._property, "iterable", args || { sorted: false });
        return this as any;
    }

    unique(): PropertyBuilder<K, V, A, P & IsUnique> {
        setAttribute(this._property, "unique", true);
        return this as any;
    }

    creatable<F extends (keyof ContextValue)[] = never[]>(flags?: F)
        : PropertyBuilder<K, V, A, P & IsCreatable<IncludesContextValue<F, "nullable">, IncludesContextValue<F, "voidable">>> {
        setContext(this._property, "creatable", flags);
        return this as any;
    }

    loadable<F extends (keyof ContextValue)[] = never[]>(flags?: F)
        : PropertyBuilder<K, V, A, P & IsLoadable<IncludesContextValue<F, "nullable">, IncludesContextValue<F, "voidable">>> {
        setContext(this._property, "loadable", flags);
        return this as any;
    }

    patchable<F extends (keyof ContextValue)[] = never[]>(flags?: F)
        : PropertyBuilder<K, V, A, P & IsPatchable<IncludesContextValue<F, "nullable">, IncludesContextValue<F, "voidable">>> {
        setContext(this._property, "patchable", flags);
        return this as any;
    }

    build(): P {
        return this._property;
    }
}
