import { Property } from "./property";
import { Primitive } from "./lang";
import { IsFilterable } from "./attribute";
import { Context, WidenValueForContext } from "./context";

export class CriteraBuilder<T, C extends Context> {
    equals<P extends Property<any, any, true> & IsFilterable>(
        select: (properties: T) => P, value: WidenValueForContext<P, C, ReturnType<P["value"]>>
    ): this;

    equals(...args: any[]) {
        return this;
    }

    select<P extends Property<any, any, false>>(
        select: (properties: T) => P,
        filter: (criteriaBuilder: CriteraBuilder<P["value"], C>) => any
    ): this {
        return this;
    }
}
