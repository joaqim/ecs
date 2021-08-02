import { EntityId, IEntity } from "Entity";
import { EntityManager } from "./EntityManager";

export interface IEntityHandle {
  id: EntityId;
  entityManager: EntityManager;

  get entity(): IEntity;
  valid(): boolean;
}
