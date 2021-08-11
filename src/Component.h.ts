// eslint-disable-next-line
import { ComponentConfig } from "./Component";

export interface IComponent {
  type?: any;
  tag?: string;
  //  [key: string]: any;
}

export type ComponentType = Function;

// export interface IComponentClass<T> {
//   readonly tag: string;
//   new (payload?: ComponentConfig<T>): T;
// }

// export type Component = Function;
