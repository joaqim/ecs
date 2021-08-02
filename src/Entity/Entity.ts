import { ComponentMap, IComponent, IComponentClass } from "Component.h";
import { EntityId, IEntity, IEntityChangeListener } from "Entity";
import { Base, BaseConstructorPayload, Model, Primed } from "Reflect";
import { v4 as uuidv4 } from "uuid";

export const PrimedEntities = (entities: IEntity[]): IEntity[] => {
  if (entities === undefined) return [];
  return entities;
};

export const PrimedId = (id?: string): EntityId => {
  if (
    id === undefined ||
    (typeof id === "string" && (id === "" || id.toUpperCase() === "UUID"))
  )
    return uuidv4().toString();
  return id;
};

/**
 * Checks if the component is an instance of the class
 * @param component The component to check
 * @param ComponentCtor The class to cast into
 */
function componentCast<T extends IComponent>(
  component: IComponent | undefined | null,
  ComponentCtor: IComponentClass<T>
): component is T {
  return !!(component && component instanceof ComponentCtor);
}

const PrimedComponentMap = (components?: ComponentMap): ComponentMap => {
  if (components === undefined) return { classes: {} };

  Object.keys(components).forEach((tag: string) => {
    if (tag === "classes") return;
    if (Object.prototype.hasOwnProperty.call(components, tag)) {
      const ComponentCtor = components.classes[tag];
      if (ComponentCtor !== undefined) {
        const newComponent = new ComponentCtor(components[tag]);
        if (!componentCast(newComponent, ComponentCtor)) {
          throw new Error("TODO");
        }
        // eslint-disable-next-line no-param-reassign
        components[tag] = newComponent;
      } else {
        throw new Error(
          `Missing "${tag}" in classes: {} of construction of ComponentMap`
        );
      }
    }
  });

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
export class Entity extends Base<Entity> implements IEntity {
  @Primed(PrimedId, { required: true })
  readonly id!: EntityId;

  private readonly listeners: IEntityChangeListener[] = [];

  // @Primed(PrimedComponentMap)
  public componentMap!: ComponentMap;

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

  set components(componentMap: ComponentMap) {
    this.componentMap = componentMap;
  }

  @Primed(PrimedComponentMap)
  get components(): ComponentMap {
    return this.componentMap;
  }

  map(
    fn: (
      key: string
    ) =>
      | IComponent
      | { component: IComponent; type: IComponentClass<IComponent> }
  ): IComponent[] {
    return Object.keys(this.components)
      .filter((key) => key !== "classes")
      .map((i) => fn(i));
  }

  /**
   * Generates a read only list of components of the entity.
   * @returns a list of all components of the entity.
   */
  listComponents(): ReadonlyArray<IComponent> {
    return this.map((i: string) => this.components[i]);
    /*
           return Object.keys(this.components)
           .filter((key) => key !=== "classes")
           .map((i) => this.components[i]);
         */
  }

  /**
   * Generates a read only list of components of the entity
   * with it's corresponding types.
   * @returns a list of all components with types of the entity.
   */

  listComponentsWithTypes(): Array<{
    component: IComponent;
    type: IComponentClass<IComponent>;
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
  listComponentsWithTags(): Array<{ tag: string; component: IComponent }> {
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
  hasComponent<T extends IComponent>(
    componentClass: IComponentClass<T>
  ): boolean {
    const { tag } = componentClass;
    const component = this.components[tag];
    if (!component) return false;
    if (!componentCast(component, componentClass)) {
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
  getComponent<T extends IComponent>(
    componentClass: IComponentClass<T>
  ): IComponent {
    const { tag } = componentClass;
    const component = this.components[tag];
    if (!component) {
      throw new Error(`Cannot get component "${tag}" from entity.`);
    }
    if (!componentCast(component, componentClass)) {
      throw new Error(
        `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
      );
    }
    return component;
  }

  getComponentByTag(tag: string): IComponent {
    // const tag = //componentClass.tag
    const component = this.components[tag];
    const componentClass = this.components.classes[tag];
    if (!component) {
      throw new Error(`Cannot get component "${tag}" from entity.`);
    }
    if (!componentCast(component, componentClass)) {
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
  putComponent<T extends IComponent>(
    ComponentCtor: IComponentClass<T>,
    payload?: BaseConstructorPayload<T>
  ): IComponent {
    const { tag } = ComponentCtor;
    const component = this.components[tag];
    if (component) {
      if (tag === "_class" || tag === "Entity") {
        // TODO: Make this check in Base/Model constructor in Reflect.ts?
        throw new Error(`Component "${tag}" is not a valid component.`);
      }

      if (component instanceof ComponentCtor) {
        throw new Error(`Component "${tag}" is already defined in Entity`);
      }

      if (!componentCast(component, ComponentCtor)) {
        throw new Error(
          `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
        );
      }
      delete this.components[tag];
      delete this.components.classes[tag];
    }
    // eslint-disable-next-line new-cap
    const newComponent = new ComponentCtor(payload);
    this.components[tag] = newComponent;
    this.components.classes[tag] = ComponentCtor;
    this.listeners.forEach((listener: IEntityChangeListener) =>
      listener.onEntityChanged(this)
    );

    return newComponent;
  }

  /**
   * Removes a component from the entity.
   * @throws If the component of that class don't exists on the entity.
   * @throws if the class than exists on the entity with that tag is different than the asked one.
   * @param componentClass The class of the component.
   */
  removeComponent<T extends IComponent>(
    componentClass: IComponentClass<T>
  ): void {
    const { tag } = componentClass;
    const component = this.components[tag];
    if (!component) {
      throw new Error(`Component of tag "${tag}".\nDoes not exists.`);
    }
    if (!componentCast(component, componentClass)) {
      throw new Error(
        `There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`
      );
    }
    delete this.components[tag];
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
