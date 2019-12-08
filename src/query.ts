import { SourceType } from "./source-type";
import { SourceTypeTapper, DefaultSourceTypeTap } from "./source-type-tapper";
import { CriteraBuilder } from "./criteria-builder";
import { TappedType } from "./tapped-type";

export type QueriedType<T extends SourceType, S extends TappedType<T>, C extends CriteraBuilder<S, "loadable">> = {
    selected: S;
    criteria: C;
};

export type DefaultQuerySelection<T extends SourceType> = DefaultSourceTypeTap<T, "loadable">;

// [todo] i think we can safely remove 'extends TappedType<T>' constraint from S
export class Query<T extends SourceType, S extends TappedType<T> = DefaultQuerySelection<T>> {
    constructor(type: T) {
        this._type = type;
        this._selector = new SourceTypeTapper(type, "loadable");
    }

    private readonly _type: T;
    private readonly _selector: SourceTypeTapper<T, "loadable", S>;

    include<O>(select: (selector: SourceTypeTapper<T, "loadable", S>) => SourceTypeTapper<T, "loadable", O>): Query<T, S & O> & this {
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
