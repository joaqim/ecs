import { Base, BaseConstructorPayload } from "./Reflect";
import { ComponentClass, Component } from "./Component";
interface EntityChangeListener {
    onEntityChanged(entity: Entity): void;
}
declare type Components = {
    [tag: string]: Component;
    classes: {
        [tag: string]: ComponentClass<Component>;
    };
};
declare class Entity extends Base<Entity> {
    private _id;
    private readonly _listeners;
    readonly components: Components;
    get id(): string | number;
    set id(value: string | number);
    isNew(): boolean;
    map(fnc: (key: string) => Component | {
        component: Component;
        type: ComponentClass<Component>;
    }): Component[];
    listComponents(): Component[];
    listComponentsWithTypes(): Array<{
        component: Component;
        type: ComponentClass<Component>;
    }>;
    listComponentsWithTags(): Array<{
        tag: string;
        component: Component;
    }>;
    hasComponent<T extends Component>(componentClass: ComponentClass<T>): boolean;
    getComponent<T extends Component>(componentClass: ComponentClass<T>): T;
    putComponent<T extends Component>(componentClass: ComponentClass<T>, payload?: BaseConstructorPayload<T>): T;
    removeComponent<T extends Component>(componentClass: ComponentClass<T>): void;
    static cast<T extends Component>(component: Component | undefined | null, componentClass: ComponentClass<T>): component is T;
    addListener(listener: EntityChangeListener): Entity;
    removeListener(listener: EntityChangeListener): Entity;
}
export { Entity, EntityChangeListener };
