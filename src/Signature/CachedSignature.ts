import type { ComponentType } from "../Component.h";
import type { IEngine } from "../Engine";
import type { IEntity } from "../Entity.h";
import { EntityConfig } from "../Entity.h";
import { AbstractSignature } from "./AbstractSignature";

/**
 * A CachedSignature is a signature than caches it's results and alters it only
 * when an entity changes.
 *
 */
export class CachedSignature<
  TProperties extends {} = {},
  TEntity extends IEntity = EntityConfig<TProperties>
> extends AbstractSignature<TProperties, TEntity> {
  // implements IEntityChangeListener
  private needEntityRefresh: boolean;

  entities: TEntity[] = [];

  constructor(engine: IEngine, exclude: ComponentType[] = []) {
    super(engine, exclude);
    const allEntities = this.engine.listEntities();
    this.entities = allEntities.filter(this.includesEntity) as TEntity[];
    // this.engine.addEntityListener(this);
    // allEntities.forEach((entity: IEntity) => entity.addListener(this));

    this.needEntityRefresh = false;
  }

  listEntities() {
    if (this.needEntityRefresh) {
      this.needEntityRefresh = false;
      this.entities = this.entities.filter(this.includesEntity);
    }
    return Object.freeze(this.entities.slice(0));
  }

  onEntityAdded(entity: IEntity) {
    const index = this.entities.indexOf(entity as unknown as TEntity);
    if (index === -1) {
      this.entities.push(entity as TEntity);
      this.needEntityRefresh = true;
      // entity.addListener(this);
    }
  }

  onEntityRemoved(entity: TEntity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      const removedEntity = this.entities[index] as IEntity;
      this.entities.splice(index, 1);
      if (removedEntity.listeners) {
        for (let listener of removedEntity.listeners) {
          listener.onEntityChanged(removedEntity);
        }
      }

      // removedEntity.removeListener(this);
    }
  }

  onEntityChanged(): void {
    this.needEntityRefresh = true;
  }
}
