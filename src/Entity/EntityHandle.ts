import { EntityId, IEntity } from "Entity";
import { IEntityHandle } from "./EntityHandle.h";
import { EntityManager } from "./EntityManager";

export class EntityHandle implements IEntityHandle {
  constructor(readonly id: EntityId, readonly entityManager: EntityManager) {}

  get entity(): IEntity {
    return this.entityManager.getEntity(this.id)!;
  }

  valid(): boolean {
    return this.entityManager.hasEntity(this.id);
  }
}
