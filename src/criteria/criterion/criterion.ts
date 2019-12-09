import { EqualsCriterion } from "./equals-criterion";
import { GreaterEqualsCriterion } from "./greater-equals-criterion";
import { LessCriterion } from "./less-criterion";
import { LessEqualsCriterion } from "./less-equals-criterion";
import { NotEqualsCriterion } from "./not-equals-criterion";
import { NotInCriterion } from "./not-in-criterion";
import { GreaterCriterion } from "./greater-criterion";
import { InCriterion } from "./in-criterion";
import { FromToCriterion } from "./from-to-criterion";

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

    type Foo = Extract<Criterion, { op: "==" }>;

    export function reducer<OP extends Criterion["op"], A = Extract<Criterion, { op: OP }>>(op: OP): (a: A, b: Criterion) => Criterion | null {
        switch (op) {
            case "==": return Equals.reduce as any;
            case "!=": return NotEquals.reduce as any;
            default: throw new Error(`no reducer known for operation '${op}'`);
        }
    }
}
