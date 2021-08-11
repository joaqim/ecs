import { v4 as uuidv4 } from "uuid";
import { ComponentConfig } from "../Component";
import type { ComponentType, IComponent } from "../Component.h";
import type { IEntity, IEntityChangeListener } from "./Entity.h";
import type { EntityId } from "./EntityId.h";

/**
 * An Entity is every object you may have on your system.
 * A character, a weapon, an skill, a map.
 * Everything is an Entity.
 * Entities are bag of Components, and Components describe how the data exists on
 * the entities.
 * Entities have an id field that can only be set once and
 * will throw when you try to get one when no id is set.
 * This set can be used to persist the entity on a database.
 */
export class Entity implements IEntity {
  readonly id: EntityId;

  private readonly listeners: IEntityChangeListener[] = [];

  tags?: string[] | undefined;

  c: { [key: string]: IComponent };

  components: any[];

  //  constructor(...args: any[]) {}

  addComponent<T extends {}>(definition: ComponentConfig<T>) {
    this.c = {
      ...this.c,
      [definition.type.name.toLowerCase()]: definition,
    };
  }

  /**
   * Sets the id of the entity to a new value.
   * @throws when the new value is null or undefined or the id is already set.
   */
  /*
       set id(value: string) {
       if (this._id !=== null && this._id !=== undefined) {
       throw new Error(`Entity id is already set as "${this._id}".`);
       }
       this._id = value;
       }

       @Primed(PrimedComponentMap)
    get components(): ComponentMap {
        return this._componentMap;
    }
     */

  /**
   * Generates a read only list of components of the entity.
   * @returns a list of all components of the entity.
   */
  listComponents(): ReadonlyArray<IComponent> {
    return Object.freeze(this.components.slice(0));
  }

  /**
   * Generates a read only list of components of the entity
   * with it's corresponding types.
   * @returns a list of all components with types of the entity.
   */

  listComponentsWithTypes(): Array<{
    component: IComponent;
    type: ComponentType;
  }> {
    return Object.entries(this.c).map(([, comp]) => ({
      type: comp.type,
      component: comp,
    }));
  }

  /**
   * Generates a read only list of components of the entity with it's corresponding tags.
   * @returns a list of all components with tags of the entity.
   */
  listComponentsWithTags(): Array<{
    component: IComponent;
    tag: string | undefined;
  }> {
    return Object.entries(this.c).map(([, comp]) =>
      Object.freeze({
        tag: comp.tag,
        component: comp,
      })
    );
  }

  /**
   * Checks if the entity has a component of the specified class.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @param componentClass The class of the component.
   */
  hasComponent(component: Function): boolean {
    return Object.prototype.hasOwnProperty.call(
      this.c,
      component.name.toLowerCase()
    );
  }

  /**
   * Returns the component of the specified class.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @throws if the component is not on the entity.
   * @param componentClass The class of the component.
   */
  getComponent(component: ComponentType): any {
    const result = Object.entries(this.c).find(
      (c: any) => c[1].type === component
    );
    if (!result)
      throw new Error(`Cannot get component "${component.name}" from entity.`);
    return result[1];

    // return result ? result[1] : undefined;
  }

  /**
   * Removes a component from the entity.
   * @throws If the component of that class don't exists on the entity.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @param componentClass The class of the component.
   */
  removeComponent(component: Function) {
    const result = Object.entries(this.c).find(
      (c: any) => c[1].type === component
    );

    if (!result)
      throw new Error(`Component "${component.name}".\nDoes not exists.`);

    delete this.c[component.name.toLowerCase()];

    // delete this.components[tag];
    this.listeners.forEach((listener: IEntityChangeListener) =>
      listener.onEntityChanged(this)
    );
  }

  /**
   * Adds a listener to the entity when components are added or removed.
   * @param listener The listener to add
   */
  addListener(listener: IEntityChangeListener): IEntity {
    const index = this.listeners.indexOf(listener);
    if (index === -1) {
      this.listeners.push(listener);
    }
    return this;
  }

  /**
   * Removes a listener from the entity.
   * @param listener The listener to remove.
   */
  removeListener(listener: IEntityChangeListener): IEntity {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
    return this;
  }
}
