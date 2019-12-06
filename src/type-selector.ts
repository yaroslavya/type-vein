import { Property, propertiesOf, ReplacePropertyValue } from "./property";
import { Unbox, Primitive } from "./lang";
import { Type } from "./type";
import { Context, HasContext, ChangeContextVoidable, hasContext } from "./context";
import { SelectionSymbol, Selection } from "./selection";
import { Select } from "./select";

export class TypeSelector<T extends Type, C extends Context, S = Select<T, HasContext<C> & Property.Primitive>> {
    constructor(type: T, context: C) {
        if (!Type.is(type)) {
            throw new Error(`expected argument 'type' to be a Type`);
        }

        this._type = type;
        this._context = context;

        let selectedType: Selection & Record<string, Property> = {
            [SelectionSymbol]: Selection.createMetadata(type),
            ...propertiesOf(type, p => Property.isPrimitive(p) && hasContext(p, context))
        };

        this._selected = selectedType as any as S;
    }

    private readonly _type: T;
    private readonly _context: C;
    private readonly _selected: S;

    select<P extends Property.Primitive & HasContext<C, any, true>>(
        select: (properties: T) => P
    ): TypeSelector<T, C, Omit<S, P["key"]> & Record<P["key"], ChangeContextVoidable<P, C, false>>>;

    select<P extends Property.Complex & HasContext<C, any, any>, E>(
        select: (properties: T) => P,
        expand: (selector: TypeSelector<Unbox<P["value"]>, C>) => TypeSelector<Unbox<P["value"]>, C, E>
    ): TypeSelector<T, C, Omit<S, P["key"]> & Record<P["key"], ReplacePropertyValue<ChangeContextVoidable<P, C, false>, E>>>;

    select(...args: any[]): any {
        if (args.length === 1 && args[0] instanceof Function) {
            let property = this._fetchProperty(args[0]);

            if (!Property.isPrimitive(property)) {
                throw new Error(`expected property '${property.key}' to be primitive`);
            }

            if (!hasContext(property, this._context)) {
                throw new Error(`expected property '${property.key}' to be have context '${this._context}'`);
            }

            if (property[this._context].voidable === false) {
                throw new Error(`expected property '${property.key}' to be voidable for context '${this._context}'`);
            }

            this._selectProperty(property);
        } else if (args.length === 2 && args[0] instanceof Function && args[1] instanceof Function) {
            let property = this._fetchProperty(args[0]);

            if (!Property.isComplex(property)) {
                throw new Error(`expected property '${property.key}' to be complex`);
            }

            if (!hasContext(property, this._context)) {
                throw new Error(`expected property '${property.key}' to be have context '${this._context}'`);
            }

            let type = this._getExpandableType(property);
            let expand: (selector: TypeSelector<any, any>) => TypeSelector<any, any> = args[1];
            let expandedType = expand(new TypeSelector(type, this._context)).build();
            this._selectProperty(property, expandedType);
        } else {
            throw new Error(`arguments didn't match any overload signature`);
        }

        return this;
    }

    private _fetchProperty(selectFromType: (type: T) => Property): Property {
        let property = selectFromType(this._type);

        if (!Property.is(property)) {
            throw new Error(`expected property selector to return a property, got '${property}' instead`);
        }

        return property;
    }

    private _getExpandableType(property: Property): Type {
        return property.value instanceof Function ? new property.value() : property.value;
    }

    private _selectProperty(property: Property & HasContext<C>, newValue?: any): void {
        let copy = { ...property };

        if (newValue !== void 0) {
            copy.value = newValue;
        }

        copy[this._context].voidable = false;

        (this._selected as any)[property.key] = copy;
    }

    build(): S {
        return this._selected;
    }
}
