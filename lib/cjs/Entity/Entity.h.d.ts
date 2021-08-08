import { ComponentMap, IComponent, IComponentClass } from "Component.h";
import { BaseConstructorPayload } from "Reflect";
import { EntityId } from "./EntityId.h";
export interface IEntity {
    id: EntityId;
    set components(componentMap: ComponentMap);
    get components(): ComponentMap;
    listComponents(): ReadonlyArray<IComponent>;
    listComponentsWithTypes(): Array<{
        component: IComponent;
        type: IComponentClass<IComponent>;
    }>;
    listComponentsWithTags(): Array<{
        tag: string;
        component: IComponent;
    }>;
    hasComponent<T extends IComponent>(componentClass: IComponentClass<T>): boolean;
    getComponent<T extends IComponent>(componentClass: IComponentClass<T>): IComponent;
    putComponent<T extends IComponent>(ComponentCtor: IComponentClass<T>, payload?: BaseConstructorPayload<T>): IComponent;
    removeComponent<T extends IComponent>(componentClass: IComponentClass<T>): void;
    addListener(listener: IEntityChangeListener): void;
    removeListener(listener: IEntityChangeListener): void;
}
export interface IEntityChangeListener {
    onEntityChanged(entity: IEntity): void;
}
