import { Type, Property, InstanceLoader, TypeQuery, Instance, TypeSymbol, SelectionSymbol, Selection, PropertyKeys, Context, HasContext, ChangeContextVoidable } from "../../src";

describe("playground", () => {
    it("playing with instance-loader", () => {
        class AlbumType {
            [TypeSymbol] = Type.createMetadata(AlbumType);
            name = Property.create("name", String, b => b.loadable(["voidable"]));
            releasedAt = Property.create("releasedAt", String, b => b.loadable());
            songs = Property.create("songs", SongType, b => b.loadable().iterable());
            artist = Property.create("songs", ArtistType, b => b.loadable(["voidable"]).iterable());
        }

        class ArtistType {
            [TypeSymbol] = Type.createMetadata(ArtistType);
            name = Property.create("name", String, b => b.loadable());
            age = Property.create("age", Number, b => b.loadable(["voidable"]));
        }

        class SongType {
            [TypeSymbol] = Type.createMetadata(SongType);
            album = Property.create("album", AlbumType, b => b.loadable(["voidable", "nullable"]));
            duration = Property.create("duration", Number, b => b.loadable());
            name = Property.create("name", String, b => b.loadable());
        }

        let albumTypeInstanceLoader: InstanceLoader<AlbumType> = {
            load(loadable, criteria) {
                // expected to be false
                loadable.releasedAt.loadable.voidable;
                loadable.songs.loadable.voidable;
                loadable.songs.value.duration.loadable.voidable;
                loadable.artist?.value.name.loadable.voidable;

                // expected to be boolean
                loadable.name?.loadable.voidable;
                loadable.artist?.loadable.voidable;
                loadable.artist?.value.age?.loadable.voidable;
                loadable.songs.value.album?.loadable.voidable;

                loadable.songs?.value[SelectionSymbol].type[TypeSymbol].class;

                new loadable[SelectionSymbol].type[TypeSymbol].class();
                let metadata = loadable[SelectionSymbol].type[TypeSymbol].class;
                loadable[SelectionSymbol].type[TypeSymbol].class;
                loadable.songs?.value[SelectionSymbol].type;

                for (let k in loadable) {

                }

                return new Map([
                    [1, {

                    } as any]
                ]);
            }
        };

        let anyTypeInstanceLoader: InstanceLoader<AlbumType | SongType> = {
            load(loadable) {

                let metadata = loadable[SelectionSymbol].type[TypeSymbol];

                if (metadata.class === AlbumType) {

                    new metadata.class().releasedAt.key;
                }
                // if (metadata.class === AlbumType) {

                // }
                // if (type[Blueprint.$Symbol].class === AlbumType) {
                //     // new type[Blueprint.$Symbol].class().
                // }

                return new Map([
                    [1, {
                        name: "foo"
                    }]
                ]);
            }
        };
    });

    it("playing with type-query", () => {
        // arrange
        class AlbumType {
            [TypeSymbol] = Type.createMetadata(AlbumType);
            name = Property.create("name", String, b => b.loadable(["voidable"]).filterable().unique());
            releasedAt = Property.create("releasedAt", String, b => b.loadable(["nullable", "voidable"]).filterable());
            songs = Property.create("songs", SongType, b => b.loadable(["voidable"]).iterable());
        }

        class SongType {
            [TypeSymbol] = Type.createMetadata(SongType);
            album = Property.create("album", AlbumType, b => b.loadable(["voidable"]));
            duration = Property.create("duration", Number, b => b.loadable(["nullable"]).filterable());
            name = Property.create("name", String, b => b.loadable().filterable());
        }

        let typeQuery = new TypeQuery(new AlbumType());

        let selectedType = typeQuery
            .include(s => s
                .select(s => s.name)
                .select(x => x.songs, s => s
                    .select(x => x.album, s => s
                        .select(x => x.releasedAt)
                    )
                )
            )
            .where(c => c
                .equals(x => x.name, "foo")
                .select(x => x.songs, c => c
                    .equals(x => x.duration, 120)
                    .equals(x => x.name, "foo")
                )
            )
            .where("or", c => c
                .equals(s => s.name, "quak")
                .select(s => s.songs, s => s.select(t => t.album, s => s.equals(t => t.releasedAt, true ? null : "2001")))
            )
            .build();

        let instance: Instance<typeof selectedType["selected"], "loadable"> = {
            name: "foo",
            songs: [{
                duration: true ? null : 3,
                name: "foo",
                album: {
                    releasedAt: "2001"
                }
            }]
        };
    });

    it("playing with inheritance on data models", () => {
        class FileSystemNode implements Type<typeof FileSystemNode> {
            [TypeSymbol] = Type.createMetadata(FileSystemNode);

            // common properties
            id = Property.create("id", String, "Id", b => b.loadable()
                .custom("folder", true as true)
                .custom("file", true as true)
                .custom("audio", true as true)
                .custom("video", true as true)
                .custom("document", true as true)
                .custom("image", true as true)
            );

            name = Property.create("name", String, "Filename", b => b.loadable());

            // folder properties
            children = Property.create("children", FileSystemNode, "Children", b => b.loadable(["voidable"]).iterable().custom("image", true as true));

            // file properties
            size = Property.create("size", Number, "FileSizeInBytes", b => b.loadable(["voidable"]));

            // properties of audio/video files
            duration = Property.create("duration", Number, "Duration", b => b.loadable(["voidable"]).custom("video", true as true).custom("audio", true as true));

            // properties of document files
            pages = Property.create("pages", Number, "Pages", b => b.loadable(["voidable"]));

            // properties of image/video files
            height = Property.create("height", Number, "Height", b => b.loadable(["voidable"]).custom("image", true as true).custom("video", true as true));
            width = Property.create("width", Number, "Width", b => b.loadable(["voidable"]).custom("image", true as true).custom("video", true as true));
        }

        type MakePropertyRequired<P extends HasContext<C>, C extends Context> = P[C]["voidable"] extends true ? ChangeContextVoidable<P, C, false> : P;

        type MakePropertiesRequired<T extends Type, C extends Context, P = Property>
            = Selection<T>
            & {
                [K in PropertyKeys<T, P & HasContext<C>>]: MakePropertyRequired<T[K], C>;
            };

        let videoInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { video: true }>, "loadable"> = {
            id: "video-id",
            duration: 543,
            height: 1080,
            width: 1920
        };

        let audioInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { audio: true }>, "loadable"> = {
            id: "audio-id",
            duration: 123
        };

        let imageInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { image: true }>, "loadable"> = {
            id: "image-id",
            children: [],
            height: 640,
            width: 800
        };
    });
});