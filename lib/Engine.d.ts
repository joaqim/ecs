import { Base, BaseConstructorPayload } from "./Reflect";
import { Entity } from "./Entity";
import { System } from "./System";
export interface EngineEntityListener {
    onEntityAdded(entity: Entity): void;
    onEntityRemoved(entity: Entity): void;
}
export declare type EntityMap = {
    entities: Entity[];
    listeners: EngineEntityListener[];
};
export declare const PrimedEntityMap: (entityMap: EntityMap) => EntityMap;
export declare class Engine extends Base<Engine> {
    entityMap: EntityMap;
    systems: System[];
    private _systemsNeedSorting;
    get listEntities(): readonly Entity[];
    notifyPriorityChange(system: System): void;
    constructor(payload?: BaseConstructorPayload<Engine, undefined>);
    awake(): Engine;
    get entities(): Entity[];
    set entities(entities: Entity[]);
    addEntityListener(listener: EngineEntityListener): Engine;
    removeEntityListener(listener: EngineEntityListener): Engine;
    addEntity(entity: Entity): Engine;
    addEntities(...entities: Entity[]): Engine;
    removeEntity(entity: Entity): Engine;
    removeEntities(...entities: Entity[]): Engine;
    addSystem(system: System): Engine;
    addSystems(...systems: System[]): Engine;
    removeSystem(system: System): Engine;
    removeSystems(...systems: System[]): Engine;
    update(delta: number): void;
}
