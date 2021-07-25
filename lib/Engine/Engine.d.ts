import { EntityMap, IEngine, IEngineEntityListener } from "Engine";
import { IEntity } from "Entity";
import { Base, BaseConstructorPayload } from "Reflect";
import { ISystem } from "System";
export declare const PrimedEntityMap: (entityMap: EntityMap) => EntityMap;
export declare class Engine extends Base<Engine> implements IEngine {
    entityMap: EntityMap;
    systems: ISystem[];
    private systemsNeedSorting;
    listEntities(): ReadonlyArray<IEntity>;
    notifyPriorityChange(system: ISystem): void;
    constructor(payload?: BaseConstructorPayload<Engine, undefined>);
    awake(): IEngine;
    get entities(): IEntity[];
    set entities(entities: IEntity[]);
    addEntityListener(listener: IEngineEntityListener): IEngine;
    removeEntityListener(listener: IEngineEntityListener): IEngine;
    addEntity(entity: IEntity): IEngine;
    addEntities(...entities: IEntity[]): IEngine;
    removeEntity(entity: IEntity): IEngine;
    removeEntities(...entities: IEntity[]): void;
    addSystem(system: ISystem): void;
    addSystems(...systems: ISystem[]): void;
    removeSystem(system: ISystem): void;
    removeSystems(...systems: ISystem[]): void;
    update(delta: number): void;
}
