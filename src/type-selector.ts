import { Property, propertiesOf, ReplacePropertyValue } from "./property";
import { Unbox } from "./lang";
import { Type } from "./type";
import { Context, HasContext } from "./context";
import { SelectionSymbol, Selection } from "./selection";
import { Select } from "./select";

export class TypeSelector<T extends Type, S = Selection<T>> {
    constructor(type: T) {
        if (!Type.is(type)) {
            throw new Error(`expected argument 'type' to be a Type`);
        }

        this._type = type;

        let selectedType: Selection = {
            [SelectionSymbol]: Selection.createMetadata(type)
        };

        this._selected = selectedType as any as S;
    }

    private readonly _type: T;
    private readonly _selected: S;

    select<C extends Context>(context: C): TypeSelector<T, S & Select<T, HasContext<C, false, any, any>>>;

    select<P extends Property.Primitive>(
        select: (properties: T) => P
    ): TypeSelector<T, S & Record<P["key"], P>>;

    select<P extends Property.Complex, E>(
        select: (properties: T) => P,
        expand: (selector: TypeSelector<Unbox<P["value"]>>) => TypeSelector<Unbox<P["value"]>, E>
    ): TypeSelector<T, S & Record<P["key"], ReplacePropertyValue<P, E>>>;

    select(...args: any[]): any {
        if (args.length === 1 && typeof args[0] === "string") {
            let properties = propertiesOf(this._type);

            for (let k in properties) {
                /**
                 * [todo] only select the ones which have context C (args[0]) and are not omittable,
                 * also crawl properties with context C of expanded types
                 */
                this._selectProperty(properties[k]);
            }
        } else if (args.length === 1 && args[0] instanceof Function) {
            this._selectProperty(this._fetchProperty(args[0]));
        } else if (args.length === 2 && args[0] instanceof Function && args[1] instanceof Function) {
            let property = this._fetchProperty(args[0]);
            let type = this._getExpandableType(property);
            let expand: (selector: TypeSelector<any>) => TypeSelector<any> = args[1];
            let expandedType = expand(new TypeSelector(type)).build();
            this._selectProperty(property, expandedType);
        } else {
            throw new Error(`arguments didn't match any overload signature`);
        }

        return this;
    }

    private _fetchProperty(selectFromType: (type: T) => Property): Property {
        return selectFromType(this._type);
    }

    private _getExpandableType(property: Property): Type {
        if (property.primitive) {
            throw new Error(`did not expect property '${property.key}' to be a primitive`);
        }

        return property.value instanceof Function ? new property.value() : property.value;
    }

    private _selectProperty(property: Property, newValue?: any): void {
        let copy = { ...property };

        if (newValue !== void 0) {
            copy.value = newValue;
        }

        (this._selected as any)[property.key] = copy;
    }

    build(): S {
        return this._selected;
    }
}
