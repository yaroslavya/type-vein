import { Type } from "./type";
import { Instance } from "./instance";
import { CriteriaForType } from "./criteria";
import { AnySelection } from "./select";

export interface InstanceLoader<T extends Type> {
    load(loadable: AnySelection<T>, criteria: CriteriaForType<T>[]): Map<string | number, Instance<AnySelection<T>, "loadable">>;
}
