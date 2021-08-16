import type { IEngine, IEngineEntityListener } from "./Engine.h";
import type { ISystem } from "../System";
import type { IEntity } from "../Entity.h";

/**
 * An engine is the class than combines systems and entities.
 * You may have one Engine in your application, but you can make as many as
 * you want.
 */

export class Engine implements IEngine {
  /** Public array containing the current list of added entities. */
  public entities: IEntity[] = [];

  /** Public list of entity listeners */
  public entityListeners: IEngineEntityListener[] = [];

  /** Public list of added systems. */
  public systems: ISystem[];

  /** Checks if the system needs sorting of some sort */
  public systemsNeedSorting = true;

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

  /**
   * Awakes the systems, necessary to use Engine
   */
  awake(): IEngine {
    this.systems.forEach((system: ISystem) => system.onAttach(this));
    return this;
  }

  /**
   * Adds a listener for when entities are added or removed.
   * @param listener The listener waiting to add
   */
  addEntityListener(listener: IEngineEntityListener) {
    if (this.entityListeners.indexOf(listener) === -1) {
      this.entityListeners.push(listener);
    }
  }

  /**
   * Removes a listener from the entity listener list.
   * @param listener The listener to remove
   */
  removeEntityListener(listener: IEngineEntityListener) {
    const index = this.entityListeners.indexOf(listener);
    if (index !== -1) {
      this.entityListeners.splice(index, 1);
    }
  }

  /**
   * Add an entity to the engine.
   * The listeners will be notified.
   * @param entity The entity to add
   */
  addEntity(entity: IEntity) {
    if (this.entities.indexOf(entity) === -1) {
      this.entities.push(entity);
      this.entityListeners.forEach((listener: IEngineEntityListener) => {
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
  addEntities(...entities: IEntity[]) {
    entities.forEach((entity: IEntity) => {
      this.entityListeners.forEach((listener: IEngineEntityListener) =>
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
  removeEntity(entity: IEntity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      this.entityListeners.forEach((listener: IEngineEntityListener) =>
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
  removeEntities(...entities: IEntity[]) {
    entities.forEach((entity: IEntity) => this.removeEntity(entity));
  }

  /**
   * Adds a system to the engine.
   * @param system The system to add.
   */
  addSystem(system: ISystem) {
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
  addSystems(...systems: ISystem[]) {
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
  update(delta: number): any {
    if (this.systemsNeedSorting) {
      this.systemsNeedSorting = false;
      this.systems.sort((a, b) => a.priority - b.priority);
    }

    return this.systems.map((system: ISystem) => system.update(this, delta));
  }
}
