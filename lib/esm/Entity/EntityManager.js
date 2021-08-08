import { Entity, EntityHandle } from "Entity";
import { v4 as uuidv4 } from "uuid";
export class EntityManager {
    entities = new Map();
    newEntity(payload) {
        const id = payload === undefined || !payload.id ? uuidv4().toString() : payload.id;
        this.entities.set(id, new Entity({ id, ...payload }));
        return new EntityHandle(id, this);
    }
    getEntity(id) {
        return this.entities.get(id);
    }
    hasEntity(id) {
        return this.entities.has(id);
    }
}
