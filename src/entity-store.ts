import { SourceType } from "./source-type";
import { Context } from "./context";
import { Instance } from "./instance";
import { Property } from "./property";

export class EntityStore<T extends SourceType, C extends Context, I = Instance<T, C>> {
    constructor(type: T, context: C) {
        this._type = type;
        this._context = context;
    }

    private readonly _type: T;
    private readonly _context: C;

    find(criteria: Partial<Instance<T, C, Property.Primitive>>): I[] {
        return [];
    }
}
