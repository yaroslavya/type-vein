import { ValueCriteria, ValueCriterion } from "../../../src";

export function expectValueCriteriaReduction(description: string, a: ValueCriteria, b: ValueCriteria, expected: ReturnType<typeof ValueCriteria.reduce> | "no-change"): void {
    let expectation = expect(ValueCriteria.reduce(a, b)).withContext(description)

    if (expected === "no-change") {
        expectation.toBe(b);
    } else {
        expectation.toEqual(expected);
    }
}

export function expectValueCriterionReduction(description: string, a: ValueCriterion, b: ValueCriterion, expected: ReturnType<typeof ValueCriterion.reduce> | "no-change"): void {
    let expectation = expect(ValueCriterion.reduce(a, b)).withContext(description)

    if (expected === "no-change") {
        expectation.toBe(b);
    } else {
        expectation.toEqual(expected);
    }
}

