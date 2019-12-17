import { ValueCriterion } from "../../../../src";

describe("criteria", () => {
    describe("reduction", () => {
        describe("in", () => {
            it("'x in [1, 2]' should completely reduce itself", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.In.create([1, 2]);
                let expected = null;

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [equals]
             */
            it("'x in [1, 2]' should completely reduce 'x == 1'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.Equals.create(1);
                let expected = null;

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should not reduce 'x == 0'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.Equals.create(0);
                let expected = b;

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [not-equals]
             */
            it("'x in [1, 2]' should reduce 'x != 3' to 'x not in [1, 2, 3]'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.NotEquals.create(3);
                let expected = ValueCriterion.NotIn.create([1, 2, 3]);

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should reduce 'x != 2' to 'x not in [1, 2]'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.NotEquals.create(2);
                let expected = ValueCriterion.NotIn.create([1, 2]);

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1]' should not reduce 'x != 1'", () => {
                // arrange
                let a = ValueCriterion.In.create([1]);
                let b = ValueCriterion.NotEquals.create(1);
                let expected = b;

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [less-equals]
             */
            it("'x in [1, 2]' should reduce 'x <= 2' to 'x < 2'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.LessEquals.create(2);
                let expected = ValueCriterion.Less.create(2);

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should not reduce 'x <= 3", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.LessEquals.create(3);
                let expected = b;

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [greater-equals]
             */
            it("'x in [1, 2]' should reduce 'x >= 2' to 'x > 2'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.GreaterEquals.create(2);
                let expected = ValueCriterion.Greater.create(2);

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should not reduce 'x >= 0", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.GreaterEquals.create(0);
                let expected = b;

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [in]
             */
            it("'x in [1, 2]' should reduce 'x in [1, 2, 3, 4]' to 'x in [3, 4]'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.In.create([1, 2, 3, 4]);
                let expected = ValueCriterion.In.create([3, 4]);

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should reduce 'x in [2, 3, 4]' to 'x in [3, 4]'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.In.create([2, 3, 4]);
                let expected = ValueCriterion.In.create([3, 4]);

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should reduce 'x in [1, 2, 3]' to 'x == 3'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.In.create([1, 2, 3]);
                let expected = ValueCriterion.Equals.create(3);

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [not-in]
             */
            it("'x in [1, 2]' should reduce 'x not in [3, 4]' to 'x not in [1, 2, 3, 4]'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.NotIn.create([3, 4]);
                let expected = ValueCriterion.NotIn.create([1, 2, 3, 4]);

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should not reduce 'x not in [1, 2]'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.NotIn.create([1, 2]);
                let expected = b;

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [from-to]
             */
            it("'x in [1, 2]' should reduce 'x >= 1 && x <= 2' to 'x > 1 && x < 2'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.FromTo.create([1, 2]);
                let expected = ValueCriterion.FromTo.create([1, 2], false);

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should not reduce 'x >= 3 && x <= 4'", () => {
                // arrange
                let a = ValueCriterion.In.create([1, 2]);
                let b = ValueCriterion.FromTo.create([3, 4]);
                let expected = b;

                // act
                let actual = ValueCriterion.In.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });
        });
    });
});
