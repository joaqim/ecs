import type { ComponentMap, IComponent, IComponentClass } from "../Component.h";
import { Base, BaseConstructorPayload } from "../Reflect";
import type { IEntity, IEntityChangeListener } from "./Entity.h";
import type { EntityId } from "./EntityId.h";
export declare const PrimedEntities: (entities: IEntity[]) => IEntity[];
export declare const PrimedId: (id?: string | undefined) => EntityId;
export declare class Entity extends Base<Entity> implements IEntity {
    readonly id: EntityId;
    private readonly listeners;
    componentMap: ComponentMap;
    set components(componentMap: ComponentMap);
    get components(): ComponentMap;
    map(fn: (key: string) => IComponent | {
        component: IComponent;
        type: IComponentClass<IComponent>;
    }): IComponent[];
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
    getComponentByTag(tag: string): IComponent;
    putComponent<T extends IComponent>(ComponentCtor: IComponentClass<T>, payload?: BaseConstructorPayload<T>): IComponent;
    removeComponent<T extends IComponent>(componentClass: IComponentClass<T>): void;
    addListener(listener: IEntityChangeListener): IEntity;
    removeListener(listener: IEntityChangeListener): IEntity;
}
