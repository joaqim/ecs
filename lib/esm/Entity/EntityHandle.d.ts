import { EntityId, IEntity } from "Entity";
import { IEntityHandle } from "./EntityHandle.h";
import { EntityManager } from "./EntityManager";
export declare class EntityHandle implements IEntityHandle {
    readonly id: EntityId;
    readonly entityManager: EntityManager;
    constructor(id: EntityId, entityManager: EntityManager);
    get entity(): IEntity;
    valid(): boolean;
}
