import { EntityConfig, IEntity } from "../Entity.h";
import { AbstractSignature } from "./AbstractSignature";

/**
 * A NonCacheSignature always computes the members of it.
 * If you find than the performance from cached signatures is not decent.
 * You can use this instead.
 * @private
 */
export class NonCachedSignature<
  TProperties extends {} = {},
  TEntity extends IEntity = EntityConfig<TProperties>
> extends AbstractSignature<TProperties, TEntity> {
  entities: readonly TEntity[];

  listEntities(): ReadonlyArray<TEntity> {
    return this.engine.listEntities().filter(this.includesEntity) as TEntity[];
  }
}
