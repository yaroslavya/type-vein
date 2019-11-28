import { Instance, InstancedValueOfProperty, AliasedInstance, AliasedRequiredInstance, AliasedOptionalInstance, PropertyAliased, KeyOfPropertyAliased } from "./instance";
// import { Selection } from "./selection";
import { Type, TypeSymbol } from "./type";
import { Property, OptionalPropertyKeys, RequiredPropertyKeys, PropertyKeys, ReplacePropertyValue, AliasOf } from "./property";
import { HasContext, IsCreatable, RemoveContextVoidable, IsLoadable } from "./context";
import { IsIterable, HasAttribute } from "./attribute";
import { SelectPartial, SelectRequiredProperties, Select } from "./select";
import { SelectionSymbol, Selection } from "./selection";
import { Unbox, Primitive } from "./lang";

class AlbumType {
    [TypeSymbol] = Type.createMetadata(AlbumType);
    // name = Property.create("name", String, b => b.creatable(["voidable"]).loadable().aliased("Name"));
    name = Property.create("name", String, "Name", b => b.creatable(["voidable"]).loadable());
    releasedAt = Property.create("releasedAt", String, b => b.creatable().loadable());
    // songs = Property.create("songs", SongType, b => b.iterable().creatable(["voidable"]));
    songs = Property.create("songs", SongType, b => b.iterable().creatable([]).loadable());
    author = Property.create("author", AuthorType, "Author", b => b.loadable().creatable(["voidable"]));
}

class SongType implements Type<typeof SongType> {
    [TypeSymbol] = Type.createMetadata(SongType);
    index = Property.create("index", Number, b => b.creatable(["nullable"]));
}

class AuthorType implements Type<typeof AuthorType> {
    [TypeSymbol] = Type.createMetadata(AuthorType);
    name = Property.create("name", String, "Name", b => b.loadable().creatable());
    album: Property<"album", typeof AlbumType> = null as any;
    bornAt: Property<"releasedAt", typeof String> & HasContext<"loadable"> = null as any;
}


let larifari: AliasedInstance<AlbumType, "creatable"> = {
    Name: void 0 || "foo",
    releasedAt: "2001",
    songs: [],
    Author: void 0 || {
        Name: "foo"
    }
};

// type SerializablePropertyValue<P extends Property & IsSerializable> = P["value"] extends Primitive ?

type X = SelectPartial<AlbumType, IsLoadable<any, false> | Property<any, any, any, false>>;


// let foo: Instance<SelectPartial<AlbumType, IsCreatable<any, true> | Property<any, any, false>>, "creatable"> = {
let foo: Instance<SelectPartial<AlbumType, IsCreatable<any, true> & Property<any, any, any, false>>, "creatable"> = {

    // releasedAt: true ? void 0 : "2001",
    // name: true ? void 0 : "foo",

    // songs: [
    //     {

    //     }
    // ]
    // songs: [
    //     {
    //         index: 3
    //     }
    // ]
};

// let instance: Instance<Select<AlbumType, IsCreatable<any, false>>, "creatable"> = {
// let instance: Instance<AnySelection<AlbumType> & Select<AlbumType>, "creatable"> = {
let anyInstance: Instance<SelectPartial<AlbumType>, "creatable"> = {
    releasedAt: true ? void 0 : "2001",
    name: true ? void 0 : "foo",
    songs: [
        {
            index: 3
        }
    ]
};


let creatableInstance: Instance<AlbumType, "creatable"> = {
    name: true ? void 0 : "foo",
    releasedAt: "2001",
    songs: [],
    author: {
        name: "foo"
    }
};

// type AlbumPartialType = AnySelection<AlbumType>;

// let albumPartialType: AlbumPartialType = {
//     [SelectionSymbol]: { type: new AlbumType() },
//     author: {
//         key: "author",
//         primitive: false,
//         loadable: { nullable: false, omittable: false, voidable: false },
//         value: {
//             [SelectionSymbol]: { type: new AuthorType() },
//             album: void 0,
//             name: new AuthorType().name,
//             bornAt: new AuthorType().bornAt
//         }
//     },
//     name: {
//         key: "name",
//         loadable: { nullable: false, omittable: false, voidable: false },
//         primitive: true,
//         value: String
//     },
//     releasedAt: void 0,
//     songs: void 0
// };


// type AlbumTypeOptionalPropertyKeys = OptionalPropertyKeys<AlbumType>;
// type AlbumTypeRequiredPropertyKeys = RequiredPropertyKeys<AlbumType>;
// type AlbumTypePropertyKeys = PropertyKeys<AlbumType>;
// // type AlbumPickedOptionalProperties = PickOptionalProperties<AlbumType>;

// // let albumPickedOptionalProperties: AlbumPickedOptionalProperties = {
// //     author: {
// //         key: "author",
// //         loadable: null as any,
// //         value: {

// //             // [Type.$Symbol]: { source: new AuthorType() },
// //             album: void 0,
// //             name: {
// //                 key: "name", loadable: null as any, value: Number
// //             }
// //         }
// //     },
// //     releasedAt: void 0
// // };

// type AlbumPickedRequiredProperties = SelectRequiredProperties<AlbumType, HasContext<"loadable">>;

// // let albumPickedRequiredProperties: AlbumPickedRequiredProperties = {
// //     [TypeMetadataSymbol]: { source: new AlbumType() },
// //     songs: {
// //         key: "songs",
// //         loadable: null as any,
// //         value: {
// //             [TypeMetadataSymbol]: { source: new SongType() },
// //             index: { key: "index", loadable: null as any, value: Number }
// //         }
// //     }
// // };


// let instanceValueOfPartialProperty: InstancedValueOfProperty<AlbumPartialType["name"], "loadable"> = true ? void 0 : "foo";
// let instancedTypeValueOfProperty: InstancedValueOfProperty<AlbumType["author"], "loadable"> = {
//     name: "susi",
//     bornAt: "2019"
// };

// let instancedIterableTypeValueOfProperty: InstancedValueOfProperty<AlbumType["songs"], "loadable"> = [
//     {
//         index: 3
//     }
// ];

// let partialAlbumTypeInstance: Instance<AnySelection<AlbumType>, "loadable"> = {
//     name: "susi",
//     author: {
//         name: "foo",
//         bornAt: "123"
//     },
//     songs: [{ index: 3 }]
// };

// let albumTypeInstance: Instance<AlbumType, "loadable"> = {
//     author: {
//         name: "foo",
//         bornAt: "123"
//     },
//     name: "foo",
//     songs: [{
//         index: 3
//     }]
// };

// type X = Instance<AnySelection<AlbumType>, "loadable">["songs"];

