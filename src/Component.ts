import { Entity } from "./Entity";
import { BaseConstructorPayload } from "./Reflect";

// eslint-disable-next-line
export interface Component {}

export interface ComponentClass<T extends Component, U = undefined> {
  readonly name: string;
  readonly tag?: string;
  new (payload?: BaseConstructorPayload<T, U>): T;
}

export type Components = {
  [tag: string]: Component;
  classes: { [tag: string]: ComponentClass<Component> };
};

export const PrimedComponents = (components?: Components): Components => {
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
          `Missing "${tag}" in classes: {} in construction of Components`
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
