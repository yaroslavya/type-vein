import { ValueCriterion } from "../../../../src";

describe("criteria", () => {
    describe("reduction", () => {
        describe("not-equals", () => {
            it("'x != 1' should completely reduce itself", () => {
                // arrange
                let a = ValueCriterion.NotEquals.create(1);
                let b = ValueCriterion.NotEquals.create(1);
                let expected = null;

                // act
                let actual = ValueCriterion.NotEquals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x != 1' should completely reduce 'x == 2'", () => {
                // arrange
                let a = ValueCriterion.NotEquals.create(1);
                let b = ValueCriterion.Equals.create(2);
                let expected = null;

                // act
                let actual = ValueCriterion.NotEquals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });
        });
    });
});
