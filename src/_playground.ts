import { Instance, InstancedValueOfProperty } from "./instance";
import { Type, TypeSymbol } from "./type";
import { Property, OptionalPropertyKeys, RequiredPropertyKeys, PropertyKeys } from "./property";
import { WithContext } from "./context";
import { WithAttribute } from "./attribute";
import { AnySelection, SelectRequiredProperties } from "./select";
import { SelectionSymbol } from "./selection";

class AlbumType {
    [TypeSymbol] = Type.createMetadata(AlbumType);
    name: Property<"name", typeof String> & WithContext<"loadable"> = null as any;
    releasedAt: Property<"releasedAt", typeof String> = null as any;
    songs: Property<"songs", typeof SongType> & WithAttribute<"iterable"> & WithContext<"loadable"> = null as any;
    author: Property<"author", typeof AuthorType> & WithContext<"loadable"> = null as any;
}

class SongType implements Type<typeof SongType> {
    [TypeSymbol] = Type.createMetadata(SongType);
    index: Property<"index", typeof Number> & WithContext<"loadable"> = null as any;
}

class AuthorType implements Type<typeof AuthorType> {
    [TypeSymbol] = Type.createMetadata(AuthorType);
    name: Property<"name", typeof String> & WithContext<"loadable"> = null as any;
    album: Property<"album", typeof AlbumType> = null as any;
    bornAt: Property<"releasedAt", typeof String> & WithContext<"loadable"> = null as any;
}

type AlbumPartialType = AnySelection<AlbumType>;

let albumPartialType: AlbumPartialType = {
    [SelectionSymbol]: { type: new AlbumType() },
    author: {
        key: "author",
        primitive: false,
        loadable: { nullable: false, omittable: false, voidable: false },
        value: {
            [SelectionSymbol]: { type: new AuthorType() },
            album: void 0,
            name: new AuthorType().name,
            bornAt: new AuthorType().bornAt
        }
    },
    name: {
        key: "name",
        loadable: { nullable: false, omittable: false, voidable: false },
        primitive: true,
        value: String
    },
    releasedAt: void 0,
    songs: void 0
};


type AlbumTypeOptionalPropertyKeys = OptionalPropertyKeys<AlbumType>;
type AlbumTypeRequiredPropertyKeys = RequiredPropertyKeys<AlbumType>;
type AlbumTypePropertyKeys = PropertyKeys<AlbumType>;
// type AlbumPickedOptionalProperties = PickOptionalProperties<AlbumType>;

// let albumPickedOptionalProperties: AlbumPickedOptionalProperties = {
//     author: {
//         key: "author",
//         loadable: null as any,
//         value: {

//             // [Type.$Symbol]: { source: new AuthorType() },
//             album: void 0,
//             name: {
//                 key: "name", loadable: null as any, value: Number
//             }
//         }
//     },
//     releasedAt: void 0
// };

type AlbumPickedRequiredProperties = SelectRequiredProperties<AlbumType, WithContext<"loadable">>;

// let albumPickedRequiredProperties: AlbumPickedRequiredProperties = {
//     [TypeMetadataSymbol]: { source: new AlbumType() },
//     songs: {
//         key: "songs",
//         loadable: null as any,
//         value: {
//             [TypeMetadataSymbol]: { source: new SongType() },
//             index: { key: "index", loadable: null as any, value: Number }
//         }
//     }
// };


let instanceValueOfPartialProperty: InstancedValueOfProperty<AlbumPartialType["name"], "loadable"> = true ? void 0 : "foo";
let instancedTypeValueOfProperty: InstancedValueOfProperty<AlbumType["author"], "loadable"> = {
    name: "susi",
    bornAt: "2019"
};

let instancedIterableTypeValueOfProperty: InstancedValueOfProperty<AlbumType["songs"], "loadable"> = [
    {
        index: 3
    }
];

let partialAlbumTypeInstance: Instance<AnySelection<AlbumType>, "loadable"> = {
    name: "susi",
    author: {
        name: "foo",
        bornAt: "123"
    },
    songs: [{ index: 3 }]
};

let albumTypeInstance: Instance<AlbumType, "loadable"> = {
    author: {
        name: "foo",
        bornAt: "123"
    },
    name: "foo",
    songs: [{
        index: 3
    }]
};

type X = Instance<AnySelection<AlbumType>, "loadable">["songs"];

