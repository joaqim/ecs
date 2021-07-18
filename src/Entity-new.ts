import { Base, BaseConstructorPayload, Model, Primed } from "./Reflect";
import { ComponentClass, Component, ComponentMap } from "./Component";
import { v4 as uuidv4 } from "uuid";

export interface EntityChangeListener {
  onEntityChanged(entity: Entity): void;
}

export const PrimedEntities = (entities: Entity[]): Entity[] => {
  if (entities == undefined) return [];
  return entities;
};

export const PrimedId = (id?: string): string | undefined => {
  if (id == "" || id?.toUpperCase() == "UUID") return uuidv4().toString();
  if (id !== undefined && id !== null) return id;
};
const PrimedComponentMap = (components?: ComponentMap): ComponentMap => {
  if (components === undefined) return { classes: {} };

  for (const tag in components) {
    if (tag === "classes") continue;
    if (Object.prototype.hasOwnProperty.call(components, tag)) {
      const componentClass = components.classes[tag];
      if (componentClass !== undefined) {
        const newComponent = new componentClass(components[tag]);
        //TODO: Is this check needed?
        if (!Entity.cast(newComponent, componentClass)) {
          throw new Error(``);
        }
        components[tag] = newComponent;
      } else {
        throw new Error(
          `Missing "${tag}" in classes: {} in construction of ComponentMap`
        );
      }
      /*TODO:
      for (let listener of this._listeners) {
        listener(this);
      }
      */
    }
  }

  return components;
};

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
@Model("Entity")
export class Entity extends Base<Entity> implements ComponentMap {
  [tag: string]: Component;
  classes: { [tag: string]: ComponentClass<Component, undefined> };

  private _id!: string;
  private readonly _listeners: EntityChangeListener[] = [];

  public _componentMap!: ComponentMap;

  /**
   * Gets the id of the entity.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Sets the id of the entity to a new value.
   * @throws when the new value is null or undefined or the id is already set.
   */
  @Primed(PrimedId, { required: false })
  set id(value: string) {
    if (this._id !== null && this._id !== undefined) {
      throw new Error(`Entity id is already set as "${this._id}".`);
    }
    this._id = value;
  }

  get components(): ComponentMap {
    return this._componentMap;
  }
  @Primed(PrimedComponentMap)
  set components(componentMap: ComponentMap) {
    this._componentMap = componentMap;
  }

  /**
   * Checks if the entity is newly created.
   * An entity is considered new when the id is null.
   */
  isNew(): boolean {
    return this._id === null;
  }

  map(
    fnc: (
      key: string
    ) => Component | { component: Component; type: ComponentClass<Component> }
  ): Component[] {
    return Object.keys(this.components)
      .filter((key) => key !== "classes")
      .map((i) => fnc(i));
  }

  /**
   * Generates a read only list of components of the entity.
   * @returns a list of all components of the entity.
   */
  listComponents(): Component[] {
    return this.map((i: string) => this.components[i]);
    /*
    return Object.keys(this.components)
      .filter((key) => key !== "classes")
      .map((i) => this.components[i]);
      */
  }

  /**
   * Generates a read only list of components of the entity
   * with it's corresponding types.
   * @returns a list of all components with types of the entity.
   */

  listComponentsWithTypes(): Array<{
    component: Component;
    type: ComponentClass<Component>;
  }> {
    return Object.keys(this.components)
      .filter((key) => key !== "classes")
      .map((i) => ({
        component: this.components[i],
        type: this.components.classes[i],
      }));
  }

  /**
   * Generates a read only list of components of the entity with it's corresponding tags.
   * @returns a list of all components with tags of the entity.
   */
  listComponentsWithTags(): Array<{ tag: string; component: Component }> {
    return Object.keys(this.components)
      .filter((key) => key !== "classes")
      .map((tag) =>
        Object.freeze({
          tag,
          component: this.components[tag],
        })
      );
  }

  /**
   * Checks if the entity has a component of the specified class.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @param componentClass The class of the component.
   */
  hasComponent<T extends Component>(
    componentClass: ComponentClass<T>
  ): boolean {
    const tag = componentClass.tag || componentClass.name;
    const component = this.components[tag];
    if (!component) return false;
    if (!Entity.cast(component, componentClass)) {
      throw new Error(
        `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
      );
    }
    return true;
  }

  /**
   * Returns the component of the specified class.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @throws if the component is not on the entity.
   * @param componentClass The class of the component.
   */
  getComponent<T extends Component>(componentClass: ComponentClass<T>): T {
    const tag = componentClass.tag || componentClass.name;
    const component = this.components[tag];
    if (!component) {
      throw new Error(`Cannot get component "${tag}" from entity.`);
    }
    if (!Entity.cast(component, componentClass)) {
      throw new Error(
        `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
      );
    }
    return component;
  }

  /**
   * Creates a component of the specified class and adds it to the entity.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @param componentClass The class of the component.
   * @returns The newly created component.
   */
  putComponent<T extends Component>(
    componentClass: ComponentClass<T>,
    payload?: BaseConstructorPayload<T>
  ): T {
    const tag = componentClass.tag || componentClass.name;
    const component = this.components[tag];
    if (component) {
      if (tag == "_class" || tag == "Entity") {
        //TODO: Make this check in Base/Model constructor in Reflect.ts?
        throw new Error(`Component "${tag}" is not a valid component.`);
      }

      if (component instanceof componentClass) {
        throw new Error(`Component "${tag}" is already defined in Entity`);
      }

      if (!Entity.cast(component, componentClass)) {
        throw new Error(
          `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
        );
      }
      delete this.components[tag];
      delete this.components.classes[tag];
    }
    const newComponent = new componentClass(payload);
    this.components[tag] = newComponent;
    this.components.classes[tag] = componentClass;
    for (const listener of this._listeners) {
      listener.onEntityChanged(this);
    }
    return newComponent;
  }

  /**
   * Removes a component from the entity.
   * @throws If the component of that class don't exists on the entity.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @param componentClass The class of the component.
   */
  removeComponent<T extends Component>(
    componentClass: ComponentClass<T>
  ): void {
    const tag = componentClass.tag || componentClass.name;
    const component = this.components[tag];
    if (!component) {
      throw new Error(`Component of tag "${tag}".\nDoes not exists.`);
    }
    if (!Entity.cast(component, componentClass)) {
      throw new Error(
        `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
      );
    }
    delete this.components[tag];
    for (const listener of this._listeners) {
      listener.onEntityChanged(this);
    }
  }

  /**
   * Checks if the component is an instance of the class
   * @param component The component to check
   * @param componentClass The class to cast into
   */
  static cast<T extends Component>(
    component: Component | undefined | null,
    componentClass: ComponentClass<T>
  ): component is T {
    return !!(component && component instanceof componentClass);
  }

  /**
   * Adds a listener to the entity when components are added or removed.
   * @param listener The listener to add
   */
  addListener(listener: EntityChangeListener): Entity {
    const index = this._listeners.indexOf(listener);
    if (index === -1) {
      this._listeners.push(listener);
    }
    return this;
  }

  /**
   * Removes a listener from the entity.
   * @param listener The listener to remove.
   */
  removeListener(listener: EntityChangeListener): Entity {
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
    return this;
  }
}
