export interface Attributes {
    filterable: true;
    indexable: true;
    iterable: {
        sorted: boolean;
    };
    unique: true;
}

export type Attribute = keyof Attributes;
export type HasAttribute<A extends Attribute> = Record<A, Attributes[A]>;

export type IsFilterable = HasAttribute<"filterable">;
export type IsIndexable = HasAttribute<"indexable">;
export type IsIterable = HasAttribute<"iterable">;
export type IsUnique = HasAttribute<"unique">;

const attributesMap: Record<Attribute, true> = {
    filterable: true,
    indexable: true,
    iterable: true,
    unique: true
};

export function allAttributes(): Attribute[] {
    return Object.keys(attributesMap) as Attribute[];
}

export function setAttribute<T extends object, A extends Attribute>(property: T, attribute: A, value: Attributes[A]): T & HasAttribute<A> {
    (property as any)[attribute] = value;

    return property as any;
}

export function hasAttribute<A extends Attribute>(property: any, attribute: A): property is HasAttribute<A> {
    return property?.[attribute] === true;
}

export function includesAttribute<A extends Attribute>(attributes: string[], attribute: A): attributes is A[] {
    return attributes.indexOf(attribute) !== -1;
}
