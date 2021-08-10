import type { ISystem } from "../System";
import type { IEntity } from "../Entity";
export interface IEngineEntityListener {
    onEntityAdded(entity: IEntity): void;
    onEntityRemoved(entity: IEntity): void;
}
export declare type EntityMap = {
    entities: IEntity[];
    listeners: IEngineEntityListener[];
};
export interface IEngine {
    systems: ISystem[];
    entityMap: EntityMap;
    awake(): IEngine;
    update(delta: number): any;
    addEntity(entity: IEntity): void;
    addEntities(...entities: IEntity[]): void;
    removeEntity(entity: IEntity): void;
    removeEntities(...entities: IEntity[]): void;
    addSystem(system: ISystem): void;
    addSystems(...systems: ISystem[]): void;
    removeSystem(system: ISystem): void;
    removeSystems(...system: ISystem[]): void;
    listEntities(): ReadonlyArray<IEntity>;
    notifyPriorityChange(system: ISystem): void;
    addEntityListener(listener: IEngineEntityListener): void;
    removeEntityListener(listener: IEngineEntityListener): void;
}
