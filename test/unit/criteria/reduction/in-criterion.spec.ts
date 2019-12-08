import { Criterion } from "../../../../src";

describe("criteria", () => {
    describe("reduction", () => {
        describe("in", () => {
            it("'x in [1, 2]' should completely reduce itself", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.In.create([1, 2]);
                let expected = null;

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [equals]
             */
            it("'x in [1, 2]' should completely reduce 'x == 1'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.Equals.create(1);
                let expected = null;

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should not reduce 'x == 0'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.Equals.create(0);
                let expected = Criterion.Equals.create(0);

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [not-equals]
             */
            it("'x in [1, 2]' should reduce 'x != 3' to 'x not in [1, 2, 3]'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.NotEquals.create(3);
                let expected = Criterion.NotIn.create([1, 2, 3]);

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [not-equals]
             */
            it("'x in [1, 2]' should reduce 'x != 2' to 'x not in [1, 2]'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.NotEquals.create(2);
                let expected = Criterion.NotIn.create([1, 2]);

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [less-equals]
             */
            it("'x in [1, 2]' should reduce 'x <= 2' to 'x < 2'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.LessEquals.create(2);
                let expected = Criterion.Less.create(2);

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [greater-equals]
             */
            it("'x in [1, 2]' should reduce 'x >= 2' to 'x > 2'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.GreaterEquals.create(2);
                let expected = Criterion.Greater.create(2);

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [in]
             */
            it("'x in [1, 2]' should reduce 'x in [1, 2, 3, 4]' to 'x in [3, 4]'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.In.create([1, 2, 3, 4]);
                let expected = Criterion.In.create([3, 4]);

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should reduce 'x in [1, 2, 3]' to 'x == 3'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.In.create([1, 2, 3]);
                let expected = Criterion.Equals.create(3);

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            it("'x in [1, 2]' should reduce 'x in [2, 3, 4]' to 'x in [3, 4]'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.In.create([2, 3, 4]);
                let expected = Criterion.In.create([3, 4]);

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [not-in]
             */
            it("'x in [1, 2]' should reduce 'x not in [3, 4]' to 'x not in [1, 2, 3, 4]'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.NotIn.create([3, 4]);
                let expected = Criterion.NotIn.create([1, 2, 3, 4]);

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });

            /**
             * [from-to]
             */
            it("'x in [1, 2]' should reduce 'x >= 1 && x <= 2' to 'x > 1 && x < 2'", () => {
                // arrange
                let a = Criterion.In.create([1, 2]);
                let b = Criterion.FromTo.create([1, 2]);
                let expected = Criterion.FromTo.create([1, 2], false);

                // act
                let actual = Criterion.In.reduce(a, b);

                // assert
                expect(actual).toEqual(expected);
            });
        });
    });
});
