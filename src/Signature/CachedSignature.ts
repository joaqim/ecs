import type { ComponentType } from "../Component.h";
import type { IEngine } from "../Engine";
import type { IEntity, IEntityChangeListener } from "../Entity";
import { AbstractSignature } from "./AbstractSignature";

/**
 * A CachedSignature is a signature than caches it's results and alters it only
 * when an entity changes.
 *
 */
export class CachedSignature<TEntity extends IEntity>
  extends AbstractSignature<TEntity>
  implements IEntityChangeListener
{
  private needEntityRefresh: boolean;

  entities: TEntity[];

  constructor(
    engine: IEngine,
    include: ComponentType[],
    exclude: ComponentType[]
  ) {
    super(engine, include, exclude);
    const allEntities = this.engine.listEntities();
    this.entities = allEntities.filter(this.includesEntity) as TEntity[];
    this.engine.addEntityListener(this);
    allEntities.forEach((entity: TEntity) => entity.addListener(this));

    this.needEntityRefresh = false;
  }

  listEntities() {
    if (this.needEntityRefresh) {
      this.needEntityRefresh = false;
      this.entities = this.entities.filter(this.includesEntity);
    }
    return Object.freeze(this.entities.slice(0));
  }

  onEntityAdded(entity: TEntity) {
    const index = this.entities.indexOf(entity);
    if (index === -1) {
      this.entities.push(entity);
      this.needEntityRefresh = true;
      entity.addListener(this);
    }
  }

  onEntityRemoved(entity: TEntity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      const removedEntity = this.entities[index];
      this.entities.splice(index, 1);
      removedEntity.removeListener(this);
    }
  }

  onEntityChanged(): void {
    this.needEntityRefresh = true;
  }
}
