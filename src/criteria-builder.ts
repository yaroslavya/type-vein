import { Property } from "./property";
import { Attribute } from "./attribute";
import { Context } from "./context";

export class CriteraBuilder<T, C extends Context> {
    equals<P extends Property.Primitive & Attribute.IsFilterable>(
        select: (properties: T) => P, value: Context.WidenValue<P, C, ReturnType<P["value"]>>
    ): this;

    equals(...args: any[]) {
        return this;
    }

    select<P extends Property.Complex>(
        select: (properties: T) => P,
        filter: (criteriaBuilder: CriteraBuilder<P["value"], C>) => any
    ): this {
        return this;
    }
}
