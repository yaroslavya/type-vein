import { ValueCriterion } from "../../../../src";

describe("criteria", () => {
    describe("reduction", () => {
        describe("equals", () => {
            it("'x == 1' should completely reduce itself", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.Equals.create(1);
                let expected = null;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x == 2'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.Equals.create(2);
                let expected = b;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [not equals]
             */
            it("'x == 1' should reduce 'x != 2' to 'x not in [1, 2]'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.NotEquals.create(2);
                let expected = ValueCriterion.NotIn.create([1, 2]);

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x != 1'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.NotEquals.create(1);
                let expected = b;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [less equals]
             */
            it("'x == 1' should reduce 'x <= 1' to 'x < 1'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.LessEquals.create(1);
                let expected = ValueCriterion.Less.create(1);

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x <= 2'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.LessEquals.create(2);
                let expected = b;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            it("'x == 1' should not reduce 'x <= 0'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.LessEquals.create(0);
                let expected = b;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [greater equals]
             */
            it("'x == 1' should reduce 'x >= 1' to 'x > 1'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.GreaterEquals.create(1);
                let expected = ValueCriterion.Greater.create(1);

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x >= 0'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.GreaterEquals.create(0);
                let expected = b;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            it("'x == 1' should not reduce 'x >= 2'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.GreaterEquals.create(2);
                let expected = b;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [in]
             */
            it("'x == 1' should reduce 'x in [1, 2, 3]' to 'x in [2, 3]'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.In.create([1, 2, 3]);
                let expected = ValueCriterion.In.create([2, 3]);

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should reduce 'x in [1, 2]' to 'x == 2'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.In.create([1, 2]);
                let expected = ValueCriterion.Equals.create(2);

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x in [2, 3]'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.In.create([2, 3]);
                let expected = b;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [not-in]
             */
            it("'x == 1' should reduce 'x not in [2, 3]' to 'x not in [1, 2, 3]'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.NotIn.create([2, 3]);
                let expected = ValueCriterion.NotIn.create([1, 2, 3]);

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x not in [1, 2]'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.NotIn.create([1, 2]);
                let expected = b;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });

            /**
             * [from-to]
             */
            it("'x == 1' should reduce '>= 1 && <= 2' to '> 1 && <= 2'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.FromTo.create([1, 2]);
                let expected = ValueCriterion.FromTo.create([1, 2], [false]);

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should completely reduce '>= 1 && <= 1'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.FromTo.create([1, 1]);
                let expected = null;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should reduce '>= 0 && <= 1' to '>= 0 && < 1'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.FromTo.create([0, 1]);
                let expected = ValueCriterion.FromTo.create([0, 1], [true, false]);

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce '>= 2 && <= 3'", () => {
                // arrange
                let a = ValueCriterion.Equals.create(1);
                let b = ValueCriterion.FromTo.create([2, 3]);
                let expected = b;

                // act
                let actual = ValueCriterion.Equals.reduce(a, b);

                // assert
                expect(actual).toBe(expected);
            });
        });
    });
});
