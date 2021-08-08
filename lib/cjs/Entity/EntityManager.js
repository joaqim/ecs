"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
const Entity_1 = require("Entity");
const uuid_1 = require("uuid");
class EntityManager {
    entities = new Map();
    newEntity(payload) {
        const id = payload === undefined || !payload.id ? uuid_1.v4().toString() : payload.id;
        this.entities.set(id, new Entity_1.Entity({ id, ...payload }));
        return new Entity_1.EntityHandle(id, this);
    }
    getEntity(id) {
        return this.entities.get(id);
    }
    hasEntity(id) {
        return this.entities.has(id);
    }
}
exports.EntityManager = EntityManager;
