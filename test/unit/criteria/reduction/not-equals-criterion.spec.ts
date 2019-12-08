import { Criterion } from "../../../../src";

describe("criteria", () => {
    describe("reduction", () => {
        describe("not-equals", () => {
            it("'x != 1' should completely reduce itself", () => {
                // arrange
                let a = Criterion.NotEquals.create(1);
                let b = Criterion.NotEquals.create(1);
                let expected = null;

                // act
                let actual = Criterion.NotEquals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x != 1' should completely reduce 'x == 2'", () => {
                // arrange
                let a = Criterion.NotEquals.create(1);
                let b = Criterion.Equals.create(2);
                let expected = null;

                // act
                let actual = Criterion.NotEquals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });
        });
    });
});
