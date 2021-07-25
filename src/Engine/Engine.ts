import { EntityMap, IEngine, IEngineEntityListener } from "Engine";
import { IEntity } from "Entity";
import { Base, BaseConstructorPayload, Model, Primed } from "Reflect";
import { ISystem, PrimedSystems } from "System";

export const PrimedEntityMap = (entityMap: EntityMap): EntityMap => {
  if (entityMap?.entities !== null && entityMap?.entities !== undefined) {
    if (entityMap !== null && entityMap.listeners !== undefined) {
      entityMap.listeners.forEach((listener: IEngineEntityListener) =>
        entityMap.entities.forEach((entity: IEntity) =>
          listener.onEntityAdded(entity)
        )
      );
      return entityMap;
    }
    return <EntityMap>{ entities: entityMap.entities, listeners: [] };
  }
  return <EntityMap>{ entities: [], listeners: [] };
};

/**
 * An engine is the class than combines systems and entities.
 * You may have one Engine in your application, but you can make as many as
 * you want.
 */

@Model
export class Engine extends Base<Engine> implements IEngine {
  /** Public array containing the current list of added entities. */
  // @Primed(Entity, { array: true })
  // public _entities!: Entity[];
  /** Public list of entity listeners */
  // public _entityListeners: EngineEntityListener[] = [];

  @Primed(PrimedEntityMap)
  public entityMap: EntityMap;

  /** Public list of added systems. */
  @Primed(PrimedSystems, { array: true })
  public systems!: ISystem[];

  /** Checks if the system needs sorting of some sort */
  private systemsNeedSorting = true;

  /**
   * Computes an immutable list of entities added to the engine.
   */
  listEntities(): ReadonlyArray<IEntity> {
    return Object.freeze(this.entities.slice(0));
  }

  /**
   * Alerts the engine to sort systems by priority.
   * @param system The system than changed priority
   */
  // eslint-disable-next-line
  notifyPriorityChange(system: ISystem): void {
    this.systemsNeedSorting = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(payload?: BaseConstructorPayload<Engine, undefined>) {
    super(payload);
  }

  awake(): IEngine {
    this.systems.forEach((system: ISystem) => system.onAttach(this));
    return this;
  }

  get entities(): IEntity[] {
    return this.entityMap.entities;
  }

  set entities(entities: IEntity[]) {
    this.entityMap.entities = entities;
  }

  /**
   * Adds a listener for when entities are added or removed.
   * @param listener The listener waiting to add
   */
  addEntityListener(listener: IEngineEntityListener): IEngine {
    if (this.entityMap.listeners.indexOf(listener) === -1) {
      this.entityMap.listeners.push(listener);
    }
    return this;
  }

  /**
   * Removes a listener from the entity listener list.
   * @param listener The listener to remove
   */
  removeEntityListener(listener: IEngineEntityListener): IEngine {
    const index = this.entityMap.listeners.indexOf(listener);
    if (index !== -1) {
      this.entityMap.listeners.splice(index, 1);
    }
    return this;
  }

  /**
   * Add an entity to the engine.
   * The listeners will be notified.
   * @param entity The entity to add
   */
  addEntity(entity: IEntity): IEngine {
    if (this.entities.indexOf(entity) === -1) {
      this.entities.push(entity);
      this.entityMap.listeners.forEach((listener: IEngineEntityListener) => {
        listener.onEntityAdded(entity);
      });
    }
    return this;
  }

  /**
   * Add a list of entities to the engine.
   * The listeners will be notified once per entity.
   * @param entities The list of entities to add
   */
  addEntities(...entities: IEntity[]): IEngine {
    entities.forEach((entity: IEntity) => {
      this.entityMap.listeners.forEach((listener: IEngineEntityListener) =>
        listener.onEntityAdded(entity)
      );
      this.addEntity(entity);
    });
    return this;
  }

  /**
   * Removes an entity to the engine.
   * The listeners will be notified.
   * @param entity The entity to remove
   */
  removeEntity(entity: IEntity): IEngine {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      this.entityMap.listeners.forEach((listener: IEngineEntityListener) =>
        listener.onEntityRemoved(entity)
      );
    }
    return this;
  }

  /**
   * Removes a list of entities to the engine.
   * The listeners will be notified once per entity.
   * @param entities The list of entities to remove
   */
  removeEntities(...entities: IEntity[]): void {
    entities.forEach((entity: IEntity) => this.removeEntity(entity));
  }

  /**
   * Adds a system to the engine.
   * @param system The system to add.
   */
  addSystem(system: ISystem): void {
    const index = this.systems.indexOf(system);
    if (index === -1) {
      this.systems.push(system);
      system.onAttach(this);
      this.systemsNeedSorting = true;
    }
  }

  /**
   * Adds a list of systems to the engine.
   * @param systems The list of systems to add.
   */
  addSystems(...systems: ISystem[]): void {
    systems.forEach((system: ISystem) => this.addSystem(system));
  }

  /**
   * Removes a system to the engine.
   * @param system The system to remove.
   */
  removeSystem(system: ISystem) {
    const index = this.systems.indexOf(system);
    if (index !== -1) {
      this.systems.splice(index, 1);
      system.onDetach(this);
    }
  }

  /**
   * Removes a list of systems to the engine.
   * @param systems The list of systems to remove.
   */
  removeSystems(...systems: ISystem[]) {
    systems.forEach((system: ISystem) => this.removeSystem(system));
  }

  /**
   * Updates all systems added to the engine.
   * @param delta Time elapsed (in milliseconds) since the last update.
   */
  update(delta: number): void {
    if (this.systemsNeedSorting) {
      this.systemsNeedSorting = false;
      this.systems.sort((a, b) => a.priority - b.priority);
    }
    this.systems.forEach((system: ISystem) => system.update(this, delta));
  }
}
