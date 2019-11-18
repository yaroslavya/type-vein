import { Property } from "./property";
import { Primitive } from "./lang";
import { IsLoadable, ContextValue, IncludesContextValue, IsCreatable, IsPatchable, Context, setContext } from "./context";
import { IsFilterable, IsIterable, IsUnique, IsIndexable, setAttribute } from "./attribute";

export class PropertyBuilder<K extends string, V, P extends Property<K, V> = Property<K, V>> {
    constructor(key: K, value: V) {
        let primitive = Primitive.is(value) as any;

        let property: Property<K, V> = {
            key, value, primitive
        };

        this._property = property as any;
    }

    readonly _property: P;

    filterable(): PropertyBuilder<K, V, P & IsFilterable> {
        setAttribute(this._property, "filterable");
        return this as any;
    }

    indexable(): PropertyBuilder<K, V, P & IsIndexable> {
        setAttribute(this._property, "indexable");
        return this as any;
    }

    iterable(): PropertyBuilder<K, V, P & IsIterable> {
        setAttribute(this._property, "iterable");

        return this as any;
    }

    unique(): PropertyBuilder<K, V, P & IsUnique> {
        setAttribute(this._property, "unique");

        return this as any;
    }

    creatable<F extends (keyof ContextValue)[] = never[]>(flags?: F)
        : PropertyBuilder<K, V, P & IsCreatable<IncludesContextValue<F, "omittable">, IncludesContextValue<F, "nullable">, IncludesContextValue<F, "voidable">>> {
        setContext(this._property, "creatable", flags);

        return this as any;
    }

    loadable<F extends (keyof ContextValue)[] = never[]>(flags?: F)
        : PropertyBuilder<K, V, P & IsLoadable<IncludesContextValue<F, "omittable">, IncludesContextValue<F, "nullable">, IncludesContextValue<F, "voidable">>> {
        setContext(this._property, "loadable", flags);

        return this as any;
    }

    patchable<F extends (keyof ContextValue)[] = never[]>(flags?: F)
        : PropertyBuilder<K, V, P & IsPatchable<IncludesContextValue<F, "omittable">, IncludesContextValue<F, "nullable">, IncludesContextValue<F, "voidable">>> {
        setContext(this._property, "patchable", flags);

        return this as any;
    }

    build(): P {
        return this._property;
    }
}

let property: Property<"foo", typeof String> = {
    key: "foo",
    primitive: true,
    value: String
};

let builder = new PropertyBuilder("foo", String).loadable(["omittable", "nullable"]).creatable()._property;
