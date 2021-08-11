// eslint-disable-next-line max-classes-per-file
import type { IEngine } from "../Engine/Engine.h";

export interface ISystem {
  priority: number;
  onAttach(engine: IEngine): void;
  onDetach(engine: IEngine): void;
  update(engine: IEngine, delta: number): any;
}

export class BaseSystem<TProperties extends {} = {}> implements ISystem {
  priority: number;
  onAttach(engine: IEngine): void {
    throw new Error("Method not implemented.");
  }
  onDetach(engine: IEngine): void {
    throw new Error("Method not implemented.");
  }
  update(engine: IEngine, delta: number) {
    throw new Error("Method not implemented.");
  }

  [key: string]: any;

  tag?: string;

  type: Function;

  properties: TProperties;
}

type Constructor<T> = { new (...args: any[]): T };
export type SystemConfig<T> = T extends BaseSystem<infer TProperties>
  ? {
      type: Constructor<T>;
      id?: string;
      entity?: string;
    } & TProperties
  : never;

export function System<TProperties extends {}>(
  properties?: TProperties
): Constructor<BaseSystem<TProperties>> &
  Constructor<BaseSystem & TProperties> {
  // @ts-ignore
  const typedClass = class TypedSystem extends System {}; // eslint-disable-line @typescript-eslint/no-shadow
  // @ts-ignore
  typedClass.properties = { ...properties };
  // @ts-ignore
  return typedClass;
}
