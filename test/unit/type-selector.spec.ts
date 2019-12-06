import { Type, Property, TypeSelector, TypeSymbol, SelectionSymbol, IsIterable, Instance } from "../../src";

describe("type-selector", () => {
    /**
     * [note] we're expecting only primitives to be copied over since otherwise we'd copy the
     * whole web of related entities, which would be unnecessarily expensive in terms of performance.
     * 
     * we are forced have to make a copy - otherwise the selected type could contain properties that
     * don't have the context specified during construction of the TypeSelector
     */
    it("should start with a copy of the source-type that contains all its primitives", () => {
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
        expect(selectedType.volume).toBe(sourceType.volume, "expected 'volume' property to be copied by reference");
        expect(selectedType.volume.loadable.voidable).toBe(true, "expected voidable property to still be voidable because it wasn't explicitly selected");
        expect((selectedType as Record<string, any>).beans).toBeUndefined("expected 'beans' property to not be copied over because it wasn't explicitly selected");
    });

    it("should create a selection as expected", () => {
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
            duration = Property.create("duration", Number, b => b.loadable(["voidable"]));
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
            .select(x => x.songs, q => q
                .select(x => x.name)
                .select(x => x.album, q => q
                    .select(x => x.releasedAt)
                )
            )
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
        expect(selectedType.songs.value.duration.loadable.voidable).toBe(true, "expected 'name' property to no longer be voidable because it was explicitly selected");
        expect(selectedType.songs.value.duration).not.toBe(songType.duration as any, "expected 'songs.duration' property to be cloned");
        expect(selectedType.songs.value.duration).toEqual(songType.duration as any, "expected 'songs.duration' property to equal the one from source");
        expect(selectedType.songs.value.album).not.toBe(selectedType as any, "unexpected type recursion in 'songs.album' property");
        expect(selectedType.songs.value.album).not.toEqual(selectedType as any, "unexpected type recursion in 'songs.album' property");
    });
});
