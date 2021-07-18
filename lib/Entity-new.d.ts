import { Base, BaseConstructorPayload } from "./Reflect";
import { ComponentClass, Component, ComponentMap } from "./Component";
export interface EntityChangeListener {
    onEntityChanged(entity: Entity): void;
}
export declare const PrimedEntities: (entities: Entity[]) => Entity[];
export declare const PrimedId: (id?: string | undefined) => string | undefined;
export declare class Entity extends Base<Entity> implements ComponentMap {
    [tag: string]: Component;
    classes: {
        [tag: string]: ComponentClass<Component, undefined>;
    };
    private _id;
    private readonly _listeners;
    _componentMap: ComponentMap;
    get id(): string;
    set id(value: string);
    get components(): ComponentMap;
    set components(componentMap: ComponentMap);
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
