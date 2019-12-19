import { Context } from "./context";
import { SourceType } from "./source-type";
import { TappedType } from "./tapped-type";
import { Property } from "./property";

export class Instancer {
    create(type: SourceType | TappedType, context: Context): any {
        let properties = Property.pick(type);
        let instance = {};

        for (let k in properties) {
            let property = properties[k];

            if (!Context.has(property, context)) {
                continue;
            }

            if (property.primitive) {
                
            } else {

            }
        }
    }
}
