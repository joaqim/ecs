import { IComponent, IComponentClass } from "Component.h";
import { IEngine } from "Engine";
import { IEntity, IEntityChangeListener } from "Entity";
import AbstractSignature from "./AbstractSignature";

/**
 * A CachedSignature is a signature than caches it's results and alters it only
 * when an entity changes.
 *
 */
export default class CachedSignature
  extends AbstractSignature
  implements IEntityChangeListener
{
  private needEntityRefresh: boolean;

  entities: IEntity[];

  constructor(
    engine: IEngine,
    include: IComponentClass<IComponent>[],
    exclude: IComponentClass<IComponent>[]
  ) {
    super(engine, include, exclude);
    const allEntities = this.engine.listEntities();
    this.entities = allEntities.filter(this.includesEntity);
    this.engine.addEntityListener(this);
    allEntities.forEach((entity: IEntity) => entity.addListener(this));

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
    const index = this.entities.indexOf(entity);
    if (index === -1) {
      this.entities.push(entity);
      this.needEntityRefresh = true;
      entity.addListener(this);
    }
  }

  onEntityRemoved(entity: IEntity) {
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
