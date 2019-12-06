import { Type, Property, TypeSelector, TypeSymbol, SelectionSymbol, IsIterable, Instance } from "../../src";

describe("type-selector", () => {
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
        expect(selectedType.name).not.toBe(sourceType.name as any, "expected property to be cloned: name");
        expect(selectedType.name).toEqual(sourceType.name as any, "expected property to equal the one from source: name");
        expect(selectedType.name.loadable.voidable).toBe(false, "expected name property to no longer be voidable because it was selected");
        expect(selectedType.songs).not.toBe(sourceType.songs as any, "expected property to be cloned: songs");
        expect(selectedType.songs.value instanceof Function).toBe(false, "expanded type was still a class: songs");
        expect(selectedType.songs.value.duration.loadable.voidable).toBe(true, "expected name property to no longer be voidable because it was selected");
        expect(selectedType.songs.value.duration).not.toBe(songType.duration as any, "expected property to be cloned: songs.duration");
        expect(selectedType.songs.value.duration).toEqual(songType.duration as any, "expected property to equal the one from source: songs.duration");
        expect(selectedType.songs.value.album).not.toBe(selectedType as any, "unexpected type recursion: songs.album");
        expect(selectedType.songs.value.album).not.toEqual(selectedType as any, "unexpected type recursion: songs.album");
    });
});
