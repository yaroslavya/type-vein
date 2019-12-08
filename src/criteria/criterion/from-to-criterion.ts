import { GreaterCriterion } from "./greater-criterion";
import { GreaterEqualsCriterion } from "./greater-equals-criterion";
import { LessCriterion } from "./less-criterion";
import { LessEqualsCriterion } from "./less-equals-criterion";

type FromCriterion = GreaterCriterion | GreaterEqualsCriterion;
type ToCriterion = LessCriterion | LessEqualsCriterion;

export interface FromToCriterion {
    op: "from-to";
    from: FromCriterion;
    to: ToCriterion;
}

export module FromToCriterion {
    export function create<T extends FromCriterion["value"], U extends ToCriterion["value"]>(values: [T, U], inclusive: boolean | [boolean] | [boolean, boolean] = true): FromToCriterion {
        if (typeof (inclusive) === "boolean") {
            inclusive = [inclusive, inclusive];
        } else if (inclusive.length === 1) {
            inclusive = [inclusive[0], true];
        }

        return {
            op: "from-to",
            from: {
                op: inclusive[0] ? ">=" : ">",
                value: values[0]
            },
            to: {
                op: inclusive[1] ? "<=" : "<",
                value: values[1]
            }
        };
    }
}
