import type { ComponentConfig } from "../Component";
import type { IComponent } from "../Component.h";

export interface IEntityChangeListener {
  onEntityChanged(entity: IEntity): void;
}

export interface IEntity {
  id?: string;
  tags?: string[];
  c: {
    [key: string]: IComponent;
  };

  components: any[];

  // listComponents(): ReadonlyArray;

  hasComponent(component: Function): boolean;
  getComponent(component: Function): any;
  removeComponent(component: Function): void;
  addComponent<T extends { readonly [K in keyof object]: any }>(
    definition: ComponentConfig<T>
  ): void;
  // ): ComponentConfig<T>;

  addListener(listener: IEntityChangeListener): void;
  removeListener(listener: IEntityChangeListener): void;
}

/*
export interface IEntity {
  id: EntityId;
  set components(componentMap: ComponentMap);
  get components(): ComponentMap;

  listComponents(): ReadonlyArray<IComponent>;
  listComponentsWithTypes(): Array<{
    component: IComponent;
    type: IComponentClass<IComponent>;
  }>;
  listComponentsWithTags(): Array<{ tag: string; component: IComponent }>;
  hasComponent<T extends IComponent>(
    componentClass: IComponentClass<T>
  ): boolean;
  getComponent<T extends IComponent>(
    componentClass: IComponentClass<T>
  ): IComponent;
  // getComponentByTag(tag: string): IComponent;
  putComponent<TComponent extends Component>(): Component;
  removeComponent<T extends IComponent>(
    componentClass: IComponentClass<T>
  ): void;

  addListener(listener: IEntityChangeListener): void;
  removeListener(listener: IEntityChangeListener): void;
}

*/
