import { Property } from "./property";
import { Primitive } from "./lang";
import { Context } from "./context";
import { Attribute } from "./attribute";

export class PropertyBuilder<K extends string, V, A extends string = K, P extends Property<K, V, A> = Property<K, V, A>> {
    constructor(key: K, value: V, alias: A) {
        let primitive = Primitive.is(value) as any;

        let property: Property<K, V, A> = {
            key, value, primitive, alias
        };

        this._property = property as any;
    }

    readonly _property: P;

    filterable(): PropertyBuilder<K, V, A, P & Attribute.IsFilterable> {
        Attribute.set(this._property, "filterable", true);
        return this as any;
    }

    indexable(): PropertyBuilder<K, V, A, P & Attribute.IsIndexable> {
        Attribute.set(this._property, "indexable", true);
        return this as any;
    }

    iterable(args?: Attribute.Iterable.Value): PropertyBuilder<K, V, A, P & Attribute.IsIterable> {
        Attribute.set(this._property, "iterable", args || { sorted: false });
        return this as any;
    }

    unique(): PropertyBuilder<K, V, A, P & Attribute.IsUnique> {
        Attribute.set(this._property, "unique", true);
        return this as any;
    }

    creatable<CTXOK extends (keyof Context.Options)[] = never[]>(optionKeys?: CTXOK)
        : PropertyBuilder<K, V, A, P & Context.IsCreatable<Context.IncludesOptionsKey<CTXOK, "nullable">, Context.IncludesOptionsKey<CTXOK, "optional">>> {
        Context.set(this._property, "creatable", optionKeys);
        return this as any;
    }

    loadable<CTXOK extends (keyof Context.Options)[] = never[]>(optionKeys?: CTXOK)
        : PropertyBuilder<K, V, A, P & Context.IsLoadable<Context.IncludesOptionsKey<CTXOK, "nullable">, Context.IncludesOptionsKey<CTXOK, "optional">>> {
        Context.set(this._property, "loadable", optionKeys);
        return this as any;
    }

    patchable<CTXOK extends (keyof Context.Options)[] = never[]>(optionKeys?: CTXOK)
        : PropertyBuilder<K, V, A, P & Context.IsPatchable<Context.IncludesOptionsKey<CTXOK, "nullable">, Context.IncludesOptionsKey<CTXOK, "optional">>> {
        Context.set(this._property, "patchable", optionKeys);
        return this as any;
    }

    custom<X extends string, Y>(key: X, value: Y): PropertyBuilder<K, V, A, P & Record<X, Y>> {
        (this._property as any)[key] = value;
        return this as any;
    }

    build(): P {
        return this._property;
    }
}
