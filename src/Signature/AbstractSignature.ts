import type { IComponent, IComponentClass } from "../Component.h";
import type { IEngine } from "../Engine";
import type { IEntity } from "../Entity";
import type { ISignature } from "./Signature.h";

/**
 * An abstract signature is the base implementation of a signature interface.
 * This class is private to this module.
 * @private
 */
export abstract class AbstractSignature implements ISignature {
  readonly engine: IEngine;

  private readonly included: ReadonlyArray<IComponentClass<IComponent>>;

  private readonly excluded: ReadonlyArray<IComponentClass<IComponent>>;

  constructor(
    engine: IEngine,
    included: IComponentClass<IComponent>[],
    excluded: IComponentClass<IComponent>[]
  ) {
    this.engine = engine;
    this.included = Object.freeze(included.slice(0));
    this.excluded = Object.freeze(excluded.slice(0));
  }

  listEntities(): ReadonlyArray<IEntity> {
    return this.engine.listEntities().filter(this.includesEntity);
  }

  includesEntity = (entity: IEntity) => {
    // TODO: Better array loop (loop over entries/keys ?)
    // eslint-disable-next-line no-restricted-syntax
    for (const include of this.included) {
      if (!entity.hasComponent(include)) {
        return false;
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const exclude of this.excluded) {
      if (entity.hasComponent(exclude)) {
        return false;
      }
    }

    return true;
  };
}
