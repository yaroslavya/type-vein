import { Instance, AliasedInstance } from "./instance";
import { Type, TypeSymbol } from "./type";
import { Property } from "./property";
import { HasContext } from "./context";

class AlbumType {
    [TypeSymbol] = Type.createMetadata(AlbumType);
    name = Property.create("name", String, "Name", b => b.creatable(["voidable"]).loadable());
    releasedAt = Property.create("releasedAt", String, b => b.creatable().loadable());
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

let creatableInstance: Instance<AlbumType, "creatable"> = {
    name: true ? void 0 : "foo",
    releasedAt: "2001",
    songs: [],
    author: {
        name: "foo"
    }
};
