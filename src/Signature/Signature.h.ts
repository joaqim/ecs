import type { ComponentType } from "../Component.h";
import type { EntityConfig, IEntity } from "../Entity.h";

export interface ISignature<
  TProperties extends {} = {},
  TEntity extends IEntity = EntityConfig<TProperties>
> {
  /**
   * Computes a list of entities on the signature.
   * The list may or may not be cached, depending of implementation.
   */
  includesEntity(entity: IEntity, compnent: ComponentType): boolean;
  listEntities(): ReadonlyArray<TEntity>;
}
