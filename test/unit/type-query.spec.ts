import { TypeSymbol, Type, Property, TypeQuery, Selection, DefaultQuerySelection } from "../../src";

describe("type-query", () => {
    it("should allow for extension by inheritance (while keeping chaining functionality)", () => {
        /**
         * [notes] it works, but only if the custom methods are at the beginning of the chain
         */

        /**
         * [arrange]
         */
        class CoffeeCupType {
            [TypeSymbol] = Type.createMetadata(CoffeeCupType);
            label = Property.create("label", String, b => b.loadable(["voidable"]));
            beans = Property.create("beans", CoffeeBeansType, b => b.loadable(["voidable"]));
            volume = Property.create("volume", Number, b => b.loadable(["voidable"]));
        }

        class CoffeeBeansType {
            [TypeSymbol] = Type.createMetadata(CoffeeBeansType);
            origin = Property.create("origin", String, b => b.loadable(["voidable"]));
            tasty = Property.create("tasty", Boolean, b => b.loadable(["voidable"]));
        }

        // [todo] 'extends Selection<CoffeeCupType>' can possibly be removed in the future
        class CoffeeCupTypeQuery<S extends Selection<CoffeeCupType> = DefaultQuerySelection<CoffeeCupType>> extends TypeQuery<CoffeeCupType, S> {
            constructor() {
                super(new CoffeeCupType());
            }

            includeLabel() {
                let selectedType = this.include(s => s.select(x => x.label)).buildSelection();

                return this as any as CoffeeCupTypeQuery<typeof selectedType>;
            }

            includeVolume() {
                let selectedType = this.include(s => s.select(x => x.volume)).buildSelection();

                return this as any as CoffeeCupTypeQuery<typeof selectedType>;
            }
        }

        /**
         * [act]
         */
        let queriedType = new CoffeeCupTypeQuery()
            .includeLabel()
            .includeVolume()
            .include(x => x.select(x => x.beans, s => s.select(x => x.tasty)))
            .build();

        /**
         * [assert] (compile time check only)
         */
        queriedType.selected.volume;
        queriedType.selected.label;
        queriedType.selected.beans.value.tasty;
    });
});
