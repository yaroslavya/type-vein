import { Type, Property, InstanceLoader, TypeQuery, Instance, WithContext, TypeSymbol, SelectionSymbol, IsIterable, IsFilterable, IsUnique } from "../../src";

describe("instance-loader", () => {
    it("should do stuff", () => {
        class AlbumType {
            [TypeSymbol] = Type.createMetadata(AlbumType);
            name: Property<"name", typeof String> = { key: "name", value: String, primitive: true };
            releasedAt: Property<"releasedAt", typeof String> = { key: "releasedAt", value: String, primitive: true };
            songs: Property<"songs", typeof SongType> & IsIterable & WithContext<"loadable"> = {
                key: "songs", value: SongType, iterable: true, loadable: { nullable: false, omittable: false, voidable: false }, primitive: false
            };
        }

        class SongType {
            [TypeSymbol] = Type.createMetadata(SongType);
            album: Property<"album", typeof AlbumType> & WithContext<"loadable"> = { key: "album", value: AlbumType, loadable: { nullable: false, omittable: false, voidable: false }, primitive: false };
            duration: Property<"duration", typeof Number> = { key: "duration", value: Number, primitive: true };
            name: Property<"name", typeof String> = { key: "name", value: String, primitive: true };
        }

        let albumTypeInstanceLoader: InstanceLoader<AlbumType> = {
            load(loadable, criteria) {
                loadable.songs?.value[SelectionSymbol].type[TypeSymbol].class;

                new loadable[SelectionSymbol].type[TypeSymbol].class();
                let metadata = loadable[SelectionSymbol].type[TypeSymbol].class;
                loadable[SelectionSymbol].type[TypeSymbol].class;
                loadable.songs?.value[SelectionSymbol].type;

                for (let k in loadable) {

                }

                return new Map([
                    [1, {}]
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
                    [1, {}]
                ]);
            }
        };
    });
});

describe("type-query", () => {
    it("should do stuff", () => {
        // arrange
        class AlbumType {
            [TypeSymbol] = Type.createMetadata(AlbumType);
            name: Property<"name", typeof String> & WithContext<"loadable"> & IsFilterable & IsUnique = {
                key: "name",
                value: String,
                filterable: true,
                loadable: { nullable: false, omittable: false, voidable: false },
                unique: true,
                primitive: true
            };

            releasedAt: Property<"releasedAt", typeof String> & WithContext<"loadable", true, true> & IsFilterable = {
                key: "releasedAt",
                value: String,
                primitive: true,
                filterable: true,
                loadable: { nullable: true, omittable: true, voidable: false }
            };

            songs: Property<"songs", typeof SongType> & WithContext<"loadable"> & IsIterable = {
                key: "songs", value: SongType, iterable: true,
                loadable: {} as any,
                primitive: false
            };
        }

        class SongType {
            [TypeSymbol] = Type.createMetadata(SongType);
            album: Property<"album", typeof AlbumType> & WithContext<"loadable", true> = {
                key: "album", value: AlbumType, loadable: { nullable: false, omittable: true, voidable: false },
                primitive: false
            };

            duration: Property<"duration", typeof Number> & IsFilterable & WithContext<"loadable", false, true> = {
                key: "duration", value: Number, filterable: true, loadable: { nullable: true, omittable: false, voidable: false },
                primitive: true
            };

            name: Property<"name", typeof String> & IsFilterable & WithContext<"loadable"> = { key: "name", value: String, loadable: {} as any, filterable: true, primitive: true };

            bar: Property<"bar", typeof String> & WithContext<"loadable", true, true> = { key: "bar", value: String, loadable: { nullable: true, omittable: true, voidable: false }, primitive: true };
        }

        // let testQuery = new TypeQuery(new AlbumType()).select(ts => ts.select(["loadable", "patchable", "unique"])).build();

        let typeQuery = new TypeQuery(new AlbumType());

        let selectedType = typeQuery
            .select(s => s.select(x => x.songs, s => s.select(x => x.album, s => s.select(x => x.releasedAt))))
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
            .build()
            ;


        let instance: Instance<typeof selectedType["selected"], "loadable"> = {
            name: "susi",
            songs: [{
                duration: true ? null : 3,
                name: "foo",
                album: {
                    releasedAt: true ? null : "2001"
                }
            }]
        };

        // let filtersName = (cb: CriteraBuilder<SelectedType<AlbumType>>) => {
        //     cb.equals(x => x.name, "lala");
        //     cb.equals("foo", x => x.name);
        //     cb.equals("lala", x => x.name);
        // };
    });
});
