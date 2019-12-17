import { EqualsCriterion } from "./equals-criterion";
import { GreaterEqualsCriterion } from "./greater-equals-criterion";
import { LessCriterion } from "./less-criterion";
import { LessEqualsCriterion } from "./less-equals-criterion";
import { NotEqualsCriterion } from "./not-equals-criterion";
import { NotInCriterion } from "./not-in-criterion";
import { GreaterCriterion } from "./greater-criterion";
import { InCriterion } from "./in-criterion";
import { FromToCriterion } from "./from-to-criterion";

// [todo] rename to "SingleValueCriterion" cause just "Criterion" is confusing, sounds like its a Union of "(SingleValue)Criterion" and "SetCriterion" and "InstanceCriteria"
export type Criterion
    = EqualsCriterion
    | FromToCriterion
    | GreaterEqualsCriterion
    | GreaterCriterion
    | InCriterion
    | LessCriterion
    | LessEqualsCriterion
    | NotEqualsCriterion
    | NotInCriterion;

export module Criterion {
    export import Equals = EqualsCriterion;
    export import FromTo = FromToCriterion;
    export import GreaterEquals = GreaterEqualsCriterion;
    export import Greater = GreaterCriterion;
    export import In = InCriterion;
    export import Less = LessCriterion;
    export import LessEquals = LessEqualsCriterion;
    export import NotEquals = NotEqualsCriterion;
    export import NotIn = NotInCriterion;

    const operations: Record<Criterion["op"], true> = {
        "!=": true, "<": true, "<=": true, "==": true, ">": true, ">=": true, "from-to": true, "not-in": true, in: true
    };

    const operationsSet = new Set(Object.keys(operations));

    export function reduce(a: Criterion, b: Criterion): Criterion | null {
        return reducer(a.op)(a, b);
    }

    export function reducer<OP extends Criterion["op"]>(op: OP): (a: Extract<Criterion, { op: OP }>, b: Criterion) => Criterion | null {
        switch (op) {
            case "==": return Equals.reduce as any;
            case "!=": return NotEquals.reduce as any;
            case "<=":
            case "<":
            case ">=":
            case ">":
            case "in":
            case "not-in":
            case "from-to":
            default: throw new Error(`no reducer known for operation '${op}'`);
        }
    }

    export function is(x?: any): x is Criterion {
        return operationsSet.has(x?.op);
    }
}
