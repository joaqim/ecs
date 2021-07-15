import { Base } from "./Reflect";
import { Entity } from "./Entity";
import { System } from "./System";
export interface EngineEntityListener {
    onEntityAdded(entity: Entity): void;
    onEntityRemoved(entity: Entity): void;
}
export declare class Engine extends Base<Engine> {
    entities: Entity[];
    entityListeners: EngineEntityListener[];
    systems: System[];
    private _systemsNeedSorting;
    get listEntities(): readonly Entity[];
    notifyPriorityChange(system: System): void;
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
