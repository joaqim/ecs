import { Entity } from "./Entity";
import { System } from "./System";
interface EngineEntityListener {
    onEntityAdded(entity: Entity): void;
    onEntityRemoved(entity: Entity): void;
}
declare class Engine {
    private _entities;
    private readonly _entityListeners;
    private readonly _systems;
    private _systemsNeedSorting;
    get entities(): readonly Entity[];
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
export { Engine, EngineEntityListener };
