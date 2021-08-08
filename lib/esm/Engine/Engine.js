import { __decorate } from "tslib";
import { Base, Model, Primed } from "Reflect";
import { PrimedSystems } from "System";
export const PrimedEntityMap = (entityMap) => {
    if (entityMap?.entities !== null && entityMap?.entities !== undefined) {
        if (entityMap !== null && entityMap.listeners !== undefined) {
            entityMap.listeners.forEach((listener) => entityMap.entities.forEach((entity) => listener.onEntityAdded(entity)));
            return entityMap;
        }
        return { entities: entityMap.entities, listeners: [] };
    }
    return { entities: [], listeners: [] };
};
let Engine = class Engine extends Base {
    entityMap;
    systems;
    systemsNeedSorting = true;
    listEntities() {
        return Object.freeze(this.entities.slice(0));
    }
    notifyPriorityChange(system) {
        this.systemsNeedSorting = true;
    }
    constructor(payload) {
        super(payload);
    }
    awake() {
        this.systems.forEach((system) => system.onAttach(this));
        return this;
    }
    get entities() {
        return this.entityMap.entities;
    }
    set entities(entities) {
        this.entityMap.entities = entities;
    }
    addEntityListener(listener) {
        if (this.entityMap.listeners.indexOf(listener) === -1) {
            this.entityMap.listeners.push(listener);
        }
    }
    removeEntityListener(listener) {
        const index = this.entityMap.listeners.indexOf(listener);
        if (index !== -1) {
            this.entityMap.listeners.splice(index, 1);
        }
    }
    addEntity(entity) {
        if (this.entities.indexOf(entity) === -1) {
            this.entities.push(entity);
            this.entityMap.listeners.forEach((listener) => {
                listener.onEntityAdded(entity);
            });
        }
        return this;
    }
    addEntities(...entities) {
        entities.forEach((entity) => {
            this.entityMap.listeners.forEach((listener) => listener.onEntityAdded(entity));
            this.addEntity(entity);
        });
        return this;
    }
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
            this.entityMap.listeners.forEach((listener) => listener.onEntityRemoved(entity));
        }
        return this;
    }
    removeEntities(...entities) {
        entities.forEach((entity) => this.removeEntity(entity));
    }
    addSystem(system) {
        const index = this.systems.indexOf(system);
        if (index === -1) {
            this.systems.push(system);
            system.onAttach(this);
            this.systemsNeedSorting = true;
        }
    }
    addSystems(...systems) {
        systems.forEach((system) => this.addSystem(system));
    }
    removeSystem(system) {
        const index = this.systems.indexOf(system);
        if (index !== -1) {
            this.systems.splice(index, 1);
            system.onDetach(this);
        }
    }
    removeSystems(...systems) {
        systems.forEach((system) => this.removeSystem(system));
    }
    update(delta) {
        if (this.systemsNeedSorting) {
            this.systemsNeedSorting = false;
            this.systems.sort((a, b) => a.priority - b.priority);
        }
        this.systems.forEach((system) => system.update(this, delta));
    }
};
__decorate([
    Primed(PrimedEntityMap)
], Engine.prototype, "entityMap", void 0);
__decorate([
    Primed(PrimedSystems, { array: true })
], Engine.prototype, "systems", void 0);
Engine = __decorate([
    Model
], Engine);
export { Engine };
