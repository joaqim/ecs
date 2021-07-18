import { BaseConstructorPayload } from "./Reflect";
import "reflect-metadata";
export interface Component {
}
export interface ComponentClass<T extends Component, U = undefined> {
    readonly name: string;
    readonly tag?: string;
    new (payload?: BaseConstructorPayload<T, U>): T;
}
export declare type ComponentMap = {
    [tag: string]: Component;
    classes: {
        [tag: string]: ComponentClass<Component>;
    };
};
