import { Criterion } from "./criterion";

export interface InCriterion {
    op: "in";
    values: Set<boolean | number | string | null>;
}

export module InCriterion {
    export function create<V extends boolean | number | string | null>(values: Iterable<V>): InCriterion {
        return { op: "in", values: new Set(values) };
    }

    /**
     * Make b smaller by reducing it by a.
     */
    export function reduce(a: InCriterion, b: Criterion): Criterion | null {
        switch (b.op) {
            case "==": return a.values.has(b.value) ? null : b;
            case "!=": return { op: "not-in", values: new Set(a.values).add(b.value) };
            case "<=": return a.values.has(b.value) ? { op: "<", value: b.value } : b;
            case ">=": return a.values.has(b.value) ? { op: ">", value: b.value } : b;

            case "in": {
                let copy = new Set(b.values);

                for (let value of b.values) {
                    if (a.values.has(value)) {
                        copy.delete(value);
                    }
                }

                if (copy.size === 0) {
                    return null
                } else if (copy.size === 1) {
                    return { op: "==", value: copy.values().next().value };
                } else {
                    return { op: "in", values: copy };
                }
            }

            case "not-in": return { op: "not-in", values: new Set([...a.values, ...b.values]) };

            case "from-to": {
                let from = b.from;
                let to = b.to;

                if (from.op === ">=" && a.values.has(from.value)) {
                    from = { op: ">", value: from.value };
                }

                if (to.op === "<=" && a.values.has(to.value)) {
                    to = { op: "<", value: to.value };
                }

                return (from == b.from && to == b.to) ? b : { op: "from-to", from: from, to: to };
            }

            default: return b;
        }
    }
}