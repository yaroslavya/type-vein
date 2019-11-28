import { Type } from "./type";
import { Instance } from "./instance";
import { CriteriaForType } from "./criteria";
import { SelectPartial } from "./select";
import { IsLoadable } from "./context";

export interface InstanceLoader<T extends Type> {
    load(loadable: SelectPartial<T, IsLoadable<any, true>>, criteria: CriteriaForType<T>[]): Map<string | number, Instance<SelectPartial<T>, "loadable">>;
}
