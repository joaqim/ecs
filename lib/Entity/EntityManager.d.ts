import { EntityId, IEntity, EntityHandle } from "Entity";
import { BaseConstructorPayload } from "Reflect";
export declare class EntityManager {
    entities: Map<EntityId, IEntity>;
    newEntity(payload?: BaseConstructorPayload<IEntity>): EntityHandle;
    getEntity(id: EntityId): IEntity | undefined;
    hasEntity(id: EntityId): boolean;
}
