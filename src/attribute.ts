export type Attribute
    = "filterable"
    | "indexable"
    | "iterable"
    | "unique";

const attributesMap: Record<Attribute, true> = {
    filterable: true,
    indexable: true,
    iterable: true,
    unique: true
};

export function allAttributes(): Attribute[] {
    return Object.keys(attributesMap) as Attribute[];
}

export type HasAttribute<F extends Attribute> = Record<F, true>;

export type IsFilterable = HasAttribute<"filterable">;
export type IsIndexable = HasAttribute<"indexable">;
export type IsIterable = HasAttribute<"iterable">;
export type IsUnique = HasAttribute<"unique">;

export function setAttribute<T extends object, A extends Attribute>(property: T, attribute: A): T & HasAttribute<A> {
    (property as any)[attribute] = true;

    return property as any;
}

export function hasAttribute<A extends Attribute>(property: any, attribute: A): property is HasAttribute<A> {
    return property?.[attribute] === true;
}

export type IncludesAttribute<T extends string[], A extends Attribute> = undefined extends T ? false : A extends T[number] ? true : false;

export function includesAttribute<A extends Attribute>(attributes: string[], attribute: A): attributes is A[] {
    return attributes.indexOf(attribute) !== -1;
}
