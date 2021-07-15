var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Base, Model, Primed } from "./Reflect";
import { Entity } from "./Entity";
import { PrimedSystems } from "./System";
let Engine = class Engine extends Base {
    constructor() {
        super(...arguments);
        this.entityListeners = [];
        this._systemsNeedSorting = false;
    }
    get listEntities() {
        return Object.freeze(this.entities.slice(0));
    }
    notifyPriorityChange(system) {
        this._systemsNeedSorting = true;
    }
    addEntityListener(listener) {
        if (this.entityListeners.indexOf(listener) === -1) {
            this.entityListeners.push(listener);
        }
        return this;
    }
    removeEntityListener(listener) {
        const index = this.entityListeners.indexOf(listener);
        if (index !== -1) {
            this.entityListeners.splice(index, 1);
        }
        return this;
    }
    addEntity(entity) {
        if (this.entities.indexOf(entity) === -1) {
            this.entities.push(entity);
            for (const listener of this.entityListeners) {
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
            for (const listener of this.entityListeners) {
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
__decorate([
    Primed(Entity, { array: true })
], Engine.prototype, "entities", void 0);
__decorate([
    Primed(PrimedSystems, { array: true })
], Engine.prototype, "systems", void 0);
Engine = __decorate([
    Model
], Engine);
export { Engine };
//# sourceMappingURL=Engine.js.map