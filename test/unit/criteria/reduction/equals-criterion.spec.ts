import { Criterion } from "../../../../src";

describe("criteria", () => {
    describe("reduction", () => {
        describe("equals", () => {
            it("'x == 1' should completely reduce itself", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.Equals.create(1);
                let expected = null;

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x == 2'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.Equals.create(2);
                let expected = Criterion.Equals.create(2);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [not equals]
             */
            it("'x == 1' should reduce 'x != 2' to 'x not in [1, 2]'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.NotEquals.create(2);
                let expected = Criterion.NotIn.create([1, 2]);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x != 1'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.NotEquals.create(1);
                let expected = Criterion.NotEquals.create(1);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [less equals]
             */
            it("'x == 1' should reduce 'x <= 1' to 'x < 1'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.LessEquals.create(1);
                let expected = Criterion.Less.create(1);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x <= 2'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.LessEquals.create(2);
                let expected = Criterion.LessEquals.create(2);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x <= 0'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.LessEquals.create(0);
                let expected = Criterion.LessEquals.create(0);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [greater equals]
             */
            it("'x == 1' should reduce 'x >= 1' to 'x > 1'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.GreaterEquals.create(1);
                let expected = Criterion.Greater.create(1);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x >= 0'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.GreaterEquals.create(0);
                let expected = Criterion.GreaterEquals.create(0);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should not reduce 'x >= 2'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.GreaterEquals.create(2);
                let expected = Criterion.GreaterEquals.create(2);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [in]
             */
            it("'x == 1' should reduce 'x in [1, 2, 3]' to 'x in [2, 3]'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.In.create([1, 2, 3]);
                let expected = Criterion.In.create([2, 3]);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should reduce 'x in [1, 2]' to 'x == 2'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.In.create([1, 2]);
                let expected = Criterion.Equals.create(2);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [not-in]
             */
            it("'x == 1' should reduce 'x not in [2, 3]' to 'x not in [1, 2, 3]'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.NotIn.create([2, 3]);
                let expected = Criterion.NotIn.create([1, 2, 3]);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [from-to]
             */
            it("'x == 1' should reduce '>= 1 && <= 2' to '> 1 && <= 2'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.FromTo.create([1, 2]);
                let expected = Criterion.FromTo.create([1, 2], [false]);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should completely reduce '>= 1 && <= 1'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.FromTo.create([1, 1]);
                let expected = null;

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x == 1' should reduce '>= 0 && <= 1' to '>= 0 && < 1'", () => {
                // arrange
                let a = Criterion.Equals.create(1);
                let b = Criterion.FromTo.create([0, 1]);
                let expected = Criterion.FromTo.create([0, 1], [true, false]);

                // act
                let actual = Criterion.Equals.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });
        });
    });
});
