import type { IEntity } from "../Entity.h";

export interface ISignature<TEntity extends IEntity> {
  /**
   * Computes a list of entities on the signature.
   * The list may or may not be cached, depending of implementation.
   */
  includesEntity(entity: TEntity): boolean;
  listEntities(): ReadonlyArray<TEntity>;
}
