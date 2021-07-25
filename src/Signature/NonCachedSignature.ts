import { IEntity } from "Entity";
import { AbstractSignature } from "./AbstractSignature";

/**
 * A NonCacheSignature always computes the members of it.
 * If you find than the performance from cached signatures is not decent.
 * You can use this instead.
 * @private
 */
export class NonCachedSignature extends AbstractSignature {
  entities: readonly IEntity[];

  listEntities(): ReadonlyArray<IEntity> {
    return this.engine.listEntities().filter(this.includesEntity);
  }
}
