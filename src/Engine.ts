import { Base, Model, Primed } from "./Reflect";
import { Entity } from "./Entity";
import { System, PrimedSystems } from "./System";

export interface EngineEntityListener {
  onEntityAdded(entity: Entity): void;
  onEntityRemoved(entity: Entity): void;
}

/**
 * An engine is the class than combines systems and entities.
 * You may have one Engine in your application, but you can make as many as
 * you want.
 */

@Model
export class Engine extends Base<Engine> {
  /** Public array containing the current list of added entities. */
  @Primed(Entity, { array: true })
  public entities!: Entity[];
  /** Public list of entity listeners */
  public entityListeners: EngineEntityListener[] = [];
  /** Public list of added systems. */
  @Primed(PrimedSystems, { array: true })
  public systems!: System[];
  /** Checks if the system needs sorting of some sort */
  private _systemsNeedSorting = false;
  /**
   * Computes an immutable list of entities added to the engine.
   */
  get listEntities(): readonly Entity[] {
    return Object.freeze(this.entities.slice(0));
  }
  /**
   * Alerts the engine to sort systems by priority.
   * @param system The system than changed priority
   */
  // eslint-disable-next-line
  notifyPriorityChange(system: System): void {
    this._systemsNeedSorting = true;
  }

  /**
   * Adds a listener for when entities are added or removed.
   * @param listener The listener waiting to add
   */
  addEntityListener(listener: EngineEntityListener): Engine {
    if (this.entityListeners.indexOf(listener) === -1) {
      this.entityListeners.push(listener);
    }
    return this;
  }

  /**
   * Removes a listener from the entity listener list.
   * @param listener The listener to remove
   */
  removeEntityListener(listener: EngineEntityListener): Engine {
    const index = this.entityListeners.indexOf(listener);
    if (index !== -1) {
      this.entityListeners.splice(index, 1);
    }
    return this;
  }

  /**
   * Add an entity to the engine.
   * The listeners will be notified.
   * @param entity The entity to add
   */
  addEntity(entity: Entity): Engine {
    if (this.entities.indexOf(entity) === -1) {
      this.entities.push(entity);
      for (const listener of this.entityListeners) {
        listener.onEntityAdded(entity);
      }
    }
    return this;
  }

  /**
   * Add a list of entities to the engine.
   * The listeners will be notified once per entity.
   * @param entities The list of entities to add
   */
  addEntities(...entities: Entity[]): Engine {
    for (const entity of entities) {
      this.addEntity(entity);
    }
    return this;
  }

  /**
   * Removes an entity to the engine.
   * The listeners will be notified.
   * @param entity The entity to remove
   */
  removeEntity(entity: Entity): Engine {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      for (const listener of this.entityListeners) {
        listener.onEntityRemoved(entity);
      }
    }
    return this;
  }

  /**
   * Removes a list of entities to the engine.
   * The listeners will be notified once per entity.
   * @param entities The list of entities to remove
   */
  removeEntities(...entities: Entity[]): Engine {
    for (const entity of entities) {
      this.removeEntity(entity);
    }
    return this;
  }

  /**
   * Adds a system to the engine.
   * @param system The system to add.
   */
  addSystem(system: System): Engine {
    const index = this.systems.indexOf(system);
    if (index === -1) {
      this.systems.push(system);
      system.onAttach(this);
      this._systemsNeedSorting = true;
    }
    return this;
  }

  /**
   * Adds a list of systems to the engine.
   * @param systems The list of systems to add.
   */
  addSystems(...systems: System[]): Engine {
    for (const system of systems) {
      this.addSystem(system);
    }
    return this;
  }

  /**
   * Removes a system to the engine.
   * @param system The system to remove.
   */
  removeSystem(system: System): Engine {
    const index = this.systems.indexOf(system);
    if (index !== -1) {
      this.systems.splice(index, 1);
      system.onDetach(this);
    }
    return this;
  }

  /**
   * Removes a list of systems to the engine.
   * @param systems The list of systems to remove.
   */
  removeSystems(...systems: System[]): Engine {
    for (const system of systems) {
      this.removeSystem(system);
    }
    return this;
  }

  /**
   * Updates all systems added to the engine.
   * @param delta Time elapsed (in milliseconds) since the last update.
   */
  update(delta: number): void {
    if (this._systemsNeedSorting) {
      this._systemsNeedSorting = false;
      this.systems.sort((a, b) => a.priority - b.priority);
    }
    for (const system of this.systems) {
      system.update(this, delta);
    }
  }
}
