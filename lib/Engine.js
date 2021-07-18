"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = exports.PrimedEntityMap = void 0;
const tslib_1 = require("tslib");
const Reflect_1 = require("./Reflect");
const System_1 = require("./System");
const PrimedEntityMap = (entityMap) => {
    if (entityMap?.entities !== null && entityMap?.entities !== undefined) {
        if (entityMap !== null && entityMap.listeners !== undefined) {
            for (const listener of entityMap.listeners) {
                for (const entity of entityMap.entities) {
                    listener.onEntityAdded(entity);
                }
            }
            return entityMap;
        }
        return { entities: entityMap.entities, listeners: [] };
    }
    return { entities: [], listeners: [] };
};
exports.PrimedEntityMap = PrimedEntityMap;
let Engine = class Engine extends Reflect_1.Base {
    entityMap;
    systems;
    _systemsNeedSorting = true;
    get listEntities() {
        return Object.freeze(this.entities.slice(0));
    }
    notifyPriorityChange(system) {
        this._systemsNeedSorting = true;
    }
    constructor(payload) {
        super(payload);
    }
    awake() {
        for (const system of this.systems) {
            system.onAttach(this);
        }
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
        return this;
    }
    removeEntityListener(listener) {
        const index = this.entityMap.listeners.indexOf(listener);
        if (index !== -1) {
            this.entityMap.listeners.splice(index, 1);
        }
        return this;
    }
    addEntity(entity) {
        if (this.entities.indexOf(entity) === -1) {
            this.entities.push(entity);
            for (const listener of this.entityMap.listeners) {
                listener.onEntityAdded(entity);
            }
        }
        return this;
    }
    addEntities(...entities) {
        for (const entity of entities) {
            this.addEntity(entity);
        }
        return this;
    }
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
            for (const listener of this.entityMap.listeners) {
                listener.onEntityRemoved(entity);
            }
        }
        return this;
    }
    removeEntities(...entities) {
        for (const entity of entities) {
            this.removeEntity(entity);
        }
        return this;
    }
    addSystem(system) {
        const index = this.systems.indexOf(system);
        if (index === -1) {
            this.systems.push(system);
            system.onAttach(this);
            this._systemsNeedSorting = true;
        }
        return this;
    }
    addSystems(...systems) {
        for (const system of systems) {
            this.addSystem(system);
        }
        return this;
    }
    removeSystem(system) {
        const index = this.systems.indexOf(system);
        if (index !== -1) {
            this.systems.splice(index, 1);
            system.onDetach(this);
        }
        return this;
    }
    removeSystems(...systems) {
        for (const system of systems) {
            this.removeSystem(system);
        }
        return this;
    }
    update(delta) {
        if (this._systemsNeedSorting) {
            this._systemsNeedSorting = false;
            this.systems.sort((a, b) => a.priority - b.priority);
        }
        for (const system of this.systems) {
            system.update(this, delta);
        }
    }
};
tslib_1.__decorate([
    Reflect_1.Primed(exports.PrimedEntityMap)
], Engine.prototype, "entityMap", void 0);
tslib_1.__decorate([
    Reflect_1.Primed(System_1.PrimedSystems, { array: true })
], Engine.prototype, "systems", void 0);
Engine = tslib_1.__decorate([
    Reflect_1.Model
], Engine);
exports.Engine = Engine;
