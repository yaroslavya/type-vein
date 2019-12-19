import { runValueCriterionEqualsOperatorReductionCases, runValueCriterionInOperatorCases, runValueCriterionNotEqualsOperatorCases, runValueCriteriaCases } from "./criteria-reduction-cases";

describe("criteria", () => {
    // [todo] reach a state so that we can rename it to "...should work for *all* cases"
    it("reduction should work for some cases", () => {
        runValueCriterionEqualsOperatorReductionCases();
        runValueCriterionNotEqualsOperatorCases();
        runValueCriterionInOperatorCases();
        runValueCriteriaCases();
    });
});
