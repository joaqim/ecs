import { Base, BaseConstructorPayload } from "@joaqim/primed-model";
import type { EntityMap, IEngine, IEngineEntityListener } from "./Engine.h";
import type { ISystem } from "../System";
import type { IEntity } from "../Entity";
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
    addEntityListener(listener: IEngineEntityListener): void;
    removeEntityListener(listener: IEngineEntityListener): void;
    addEntity(entity: IEntity): this;
    addEntities(...entities: IEntity[]): this;
    removeEntity(entity: IEntity): this;
    removeEntities(...entities: IEntity[]): void;
    addSystem(system: ISystem): void;
    addSystems(...systems: ISystem[]): void;
    removeSystem(system: ISystem): void;
    removeSystems(...systems: ISystem[]): void;
    update(delta: number): any;
}
