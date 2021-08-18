import { ComponentType } from "../Component.h";
import type { IEngine } from "../Engine";
import type { EntityConfig, IEntity } from "../Entity.h";
import type { ISignature } from "./Signature.h";

/**
 * An abstract signature is the base implementation of a signature interface.
 * This class is private to this module.
 * @private
 */
export abstract class AbstractSignature<
  TProperties extends {} = {},
  TEntity extends IEntity = EntityConfig<TProperties>
> implements ISignature<TProperties, TEntity>
{
  readonly engine: IEngine;

  private readonly excluded: ReadonlyArray<ComponentType> = [];

  private readonly included: string[];

  constructor(
    engine: IEngine,
    included: string[],
    ...excluded: ComponentType[]
  ) {
    this.engine = engine;
    this.included = included;
    this.excluded = Object.freeze(excluded.slice(0));
  }

  listEntities(): ReadonlyArray<TEntity> {
    return this.engine.listEntities().filter(this.includesEntity) as TEntity[];
  }

  includesEntity = (entity: IEntity) =>
    !this.excluded.some(
      (exclude: ComponentType) =>
        entity.c[exclude.name.toLowerCase()] !== undefined
      // isOfType<{ [key: string]: ComponentType }>(
      //   entity.c,
      //   exclude.name.toLowerCase()
      // )
    ) && this.included.every((include: string) => !!entity.c[include]);
  // isOfType<{ [key: string]: ComponentType }>(
  //   entity.c,
  //   exclude.name.toLowerCase()
  // )
  // isOfType<TEntity>(entity, "c");
}
