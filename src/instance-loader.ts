import { Type } from "./type";
import { Instance } from "./instance";
import { CriteriaForType } from "./criteria";
import { PickedVoidables } from "./context";

export interface InstanceLoader<T extends Type> {
    load(loadable: PickedVoidables<T, "loadable">, criteria: CriteriaForType<T>[]): Map<string | number, Instance<T, "loadable">>;
}
