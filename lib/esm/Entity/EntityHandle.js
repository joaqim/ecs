export class EntityHandle {
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
