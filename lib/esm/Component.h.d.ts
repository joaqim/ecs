import { BaseConstructorPayload } from "./Reflect";
export interface IComponent {
}
export interface IComponentClass<T extends IComponent, U = undefined> {
    readonly tag: string;
    new (payload?: BaseConstructorPayload<T, U>): T;
}
export declare type ComponentMap = {
    [tag: string]: IComponent;
    classes: {
        [tag: string]: IComponentClass<IComponent>;
    };
};
