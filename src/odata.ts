import { SourceType } from "./source-type";
import { Property } from "./property";
import { TappedType } from "./tapped-type";

export module OData {
    export function buildExpandSelectQueryStrings<T extends SourceType | TappedType>(type: T): { $expand: string; $select: string; } {
        let properties = Property.pick(type);

        for (let k in properties) {
            properties[k].key;
        }

        return {
            $expand: "",
            $select: ""
        };
    }
}
