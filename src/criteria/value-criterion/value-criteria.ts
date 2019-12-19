import { ValueCriterion } from "./value-criterion";

export type ValueCriteria = ValueCriterion[];

export module ValueCriteria {
    export function is(x?: any): x is ValueCriteria {
        return x instanceof Array && x.every(x => ValueCriterion.is(x));
    }

    export function pick(from: Record<string, any>) : Record<string, ValueCriteria> {
        let picked : Record<string, ValueCriteria> = {};

        for(let k in from) {
            if(is(from[k])) {
                picked[k] = from[k];
            }
        }

        return picked;
    }

    export function reduce(a: ValueCriteria, b: ValueCriteria): ValueCriteria | null {
        let reduced = b.slice();
        let didReduce = false;

        for (let criterionA of a) {
            let nextReduced: ValueCriteria = [];

            for (let criterionB of reduced) {
                let reducedCriterion = ValueCriterion.reduce(criterionA, criterionB);

                if (reducedCriterion !== null) {
                    nextReduced.push(reducedCriterion);
                }

                if (reducedCriterion !== criterionB && !didReduce) {
                    didReduce = true;
                }
            }

            reduced = nextReduced;
        }

        return didReduce
            ? reduced.length > 0 ? reduced : null
            : b;
    }
}