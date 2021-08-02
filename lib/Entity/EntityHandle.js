"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityHandle = void 0;
class EntityHandle {
    id;
    entityManager;
    constructor(id, entityManager) {
        this.id = id;
        this.entityManager = entityManager;
    }
    get entity() {
        return this.entityManager.getEntity(this.id);
    }
    valid() {
        return this.entityManager.hasEntity(this.id);
    }
}
exports.EntityHandle = EntityHandle;
