import { BaseConstructorPayload } from "./Reflect";
export interface Component {
}
export interface ComponentClass<T extends Component, U = undefined> {
    readonly name: string;
    readonly tag?: string;
    new (payload?: BaseConstructorPayload<T, U>): T;
}
export declare type Components = {
    [tag: string]: Component;
    classes: {
        [tag: string]: ComponentClass<Component>;
    };
};
export declare const PrimedComponents: (components?: Components | undefined) => Components;
