import { Type, Property, TypeSelector, TypeSymbol, SelectionSymbol, Instance } from "../../src";

describe("type-selector", () => {
    it("should start with a copy of the source-type that contains all non-voidable properties (deep)", () => {
        /**
         * [arrange]
         */
        class CoffeeCupType {
            [TypeSymbol] = Type.createMetadata(CoffeeCupType);
            label = Property.create("label", String, b => b.loadable());
            beans = Property.create("beans", CoffeeBeansType, b => b.loadable());
            volume = Property.create("volume", Number, b => b.loadable(["voidable"]));
        }

        class CoffeeBeansType {
            [TypeSymbol] = Type.createMetadata(CoffeeBeansType);
            origin = Property.create("origin", String, b => b.loadable(["voidable"]));
            tasty = Property.create("tasty", Boolean, b => b.loadable());
        }

        let sourceType = new CoffeeCupType();

        /**
         * [act]
         */
        let typeSelector = new TypeSelector(sourceType, "loadable");
        let selectedType = typeSelector.build();

        /**
         * [assert]
         */
        expect(selectedType[SelectionSymbol].type[TypeSymbol].class).toBe(CoffeeCupType, "source metadata class was expected to be 'CoffeeCupType'");
        expect(selectedType.label).toBe(sourceType.label, "expected 'label' property to be copied by reference");
        expect(selectedType.beans).toBeDefined("expected 'beans' property to be defined");
        expect(selectedType.beans.value.tasty).toBeDefined("expected 'beans.tasty' property to be defined");

        expect((selectedType as Record<string, any>).volume).toBeUndefined("expected 'volume' property to not be copied over because it wasn't explicitly selected");
    });

    it("should allow us to assign instance of selected type to be assignable to default instance", () => {
        /**
         * [arrange]
         */
        class CoffeeCupType {
            [TypeSymbol] = Type.createMetadata(CoffeeCupType);
            label = Property.create("label", String, b => b.loadable());
            beans = Property.create("beans", CoffeeBeansType, b => b.loadable());
            volume = Property.create("volume", Number, b => b.loadable(["voidable"]));
        }

        class CoffeeBeansType {
            [TypeSymbol] = Type.createMetadata(CoffeeBeansType);
            origin = Property.create("origin", String, b => b.loadable(["voidable"]));
            tasty = Property.create("tasty", Boolean, b => b.loadable());
        }

        function takesCoffeeCupTypeInstance(instance: Instance<CoffeeCupType, "loadable">): void {
            if (instance.volume !== void 0) {
                // do stuff
            }
        }

        /**
         * [act]
         */
        let typeSelector = new TypeSelector(new CoffeeCupType(), "loadable");
        let selectedType = typeSelector.build();
        let instance: Instance<typeof selectedType, "loadable"> = {
            beans: {
                tasty: true
            },
            label: "tasty coffee"
        };

        /**
         * [assert] (compile time check only)
         */
        takesCoffeeCupTypeInstance(instance);
    });

    // it("should allow us to include voidable properties and make them non-voidable", () => {
    //     // todo
    // });

    it("should create a selection as expected (spec needs some rework)", () => {
        /**
         * [arrange]
         */
        class AlbumType {
            [TypeSymbol] = Type.createMetadata(AlbumType);
            name = Property.create("name", String, b => b.loadable(["voidable"]));
            releasedAt = Property.create("releasedAt", String, b => b.loadable(["voidable"]));
            songs = Property.create("songs", SongType, b => b.iterable().loadable());
        }

        class SongType {
            [TypeSymbol] = Type.createMetadata(SongType);
            album = Property.create("album", AlbumType, b => b.loadable(["voidable"]));
            duration = Property.create("duration", Number, b => b.loadable());
            name = Property.create("name", String, b => b.loadable(["voidable"]));
        }

        let sourceType = new AlbumType();
        let songType = new SongType();
        let typeSelector = new TypeSelector(sourceType, "loadable");

        /**
         * [act]
         */
        let selectedType = typeSelector
            .select(x => x.name)
            .select(x => x.songs)
            .build();

        /**
         * [assert]
         */
        let sourceMetadata = selectedType[SelectionSymbol].type[TypeSymbol];

        expect(sourceMetadata.class).toBe(AlbumType, "source metadata class was expected to be 'AlbumType'");
        expect(selectedType.name).not.toBe(sourceType.name as any, "expected 'name' property to be cloned");
        expect(selectedType.name).toEqual(sourceType.name as any, "expected 'name' property to equal the one from source");
        expect(selectedType.name.loadable.voidable).toBe(false, "expected 'name' property to no longer be voidable because it was selected");
        expect(selectedType.songs).not.toBe(sourceType.songs as any, "expected 'songs' property to be cloned");
        expect(selectedType.songs.value instanceof Function).toBe(false, "expanded type in property 'songs' was still a class");
        expect(selectedType.songs.value.duration).not.toBe(songType.duration as any, "expected 'songs.duration' property to be cloned");
        // expect(selectedType.songs.value.album).not.toBe(selectedType as any, "unexpected type recursion in 'songs.album' property");
        // expect(selectedType.songs.value.album).not.toEqual(selectedType as any, "unexpected type recursion in 'songs.album' property");
    });
});
