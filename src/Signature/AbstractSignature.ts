import type { ComponentType } from "../Component.h";
import type { IEngine } from "../Engine";
import type { IEntity } from "../Entity.h";
import type { ISignature } from "./Signature.h";

/**
 * An abstract signature is the base implementation of a signature interface.
 * This class is private to this module.
 * @private
 */
export abstract class AbstractSignature<TEntity extends IEntity>
  implements ISignature<TEntity>
{
  readonly engine: IEngine;

  private readonly included: ReadonlyArray<ComponentType>;

  private readonly excluded: ReadonlyArray<ComponentType>;

  constructor(
    engine: IEngine,
    included: ComponentType[],
    excluded: ComponentType[]
  ) {
    this.engine = engine;
    this.included = Object.freeze(included.slice(0));
    this.excluded = Object.freeze(excluded.slice(0));
  }

  listEntities(): ReadonlyArray<TEntity> {
    return this.engine.listEntities().filter(this.includesEntity) as TEntity[];
  }

  includesEntity(entity: TEntity): boolean {
    return (
      (!this.excluded.some((exclude: Function) =>
        Object.prototype.hasOwnProperty.call(
          entity.c,
          exclude.name.toLowerCase()
        )
      ) &&
        this.included.every((include: Function) =>
          Object.prototype.hasOwnProperty.call(
            entity.c,
            include.name.toLowerCase()
          )
        )) ||
      false
    );
  }
}
