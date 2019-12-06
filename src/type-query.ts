import { Type } from "./type";
import { TypeSelector } from "./type-selector";
import { CriteraBuilder } from "./criteria-builder";
import { HasContext } from "./context";
import { Select } from "./select";
import { Selection } from "./selection";

export type QueriedType<T extends Type, S extends Selection<T>, C extends CriteraBuilder<S, "loadable">> = {
    selected: S;
    criteria: C;
};

export type DefaultQuerySelection<T extends Type> = Select<T, HasContext<"loadable", any, false>>;

// [todo] i think we can safely remove 'extends Selection<T>' constraint from S
export class TypeQuery<T extends Type, S extends Selection<T> = DefaultQuerySelection<T>> {
    constructor(type: T) {
        this._type = type;
        this._selector = new TypeSelector(type, "loadable");
    }

    private readonly _type: T;
    private readonly _selector: TypeSelector<T, "loadable", S>;

    include<O>(select: (selector: TypeSelector<T, "loadable", S>) => TypeSelector<T, "loadable", O>): TypeQuery<T, S & O> & this {
        select(this._selector);
        return this as any;
    }

    where(filter: (criteriaBuilder: CriteraBuilder<S, "loadable">) => any): this;
    where(operand: "and" | "or", filter: (criteriaBuilder: CriteraBuilder<S, "loadable">) => any): this;

    where(...args: any[]): this {
        return this;
    }

    build(): QueriedType<T, S, CriteraBuilder<S, "loadable">> {
        return {
            selected: this._selector.build(),
            criteria: {} as CriteraBuilder<S, "loadable">
        };
    }

    buildSelection(): S {
        return this._selector.build();
    }
}
