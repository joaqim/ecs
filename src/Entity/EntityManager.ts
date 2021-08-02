import { EntityId, Entity, IEntity, EntityHandle } from "Entity";
import { BaseConstructorPayload } from "Reflect";
import { v4 as uuidv4 } from "uuid";
// import { BaseConstructorPayload } from "Reflect";

export class EntityManager {
  entities = new Map<EntityId, IEntity>();

  newEntity(payload?: BaseConstructorPayload<IEntity>): EntityHandle {
    const id =
      payload === undefined || !payload.id ? uuidv4().toString() : payload.id;

    this.entities.set(id, new Entity({ id, ...payload }));
    return new EntityHandle(id, this);
  }

  getEntity(id: EntityId): IEntity | undefined {
    return this.entities.get(id);
  }

  hasEntity(id: EntityId): boolean {
    return this.entities.has(id);
  }
}
