// eslint-disable-next-line max-classes-per-file
import type { IComponent } from "./Component.h";

export class BaseComponent<TProperties extends {} = {}> implements IComponent {
  [key: string]: any;

  tag?: string;

  type: Function;

  properties: TProperties;
}

type Constructor<T> = { new (...args: any[]): T };
export type ComponentConfig<T> = T extends BaseComponent<infer TProperties>
  ? {
      type: Constructor<T>;
      id?: string;
      entity?: string;
    } & TProperties
  : never;

export function Component<TProperties extends {}>(
  properties?: TProperties
): Constructor<BaseComponent<TProperties>> &
  Constructor<BaseComponent & TProperties> {
  // @ts-ignore
  const typedClass = class TypedComponent extends Component {}; // eslint-disable-line @typescript-eslint/no-shadow
  // @ts-ignore
  typedClass.properties = { ...properties };
  // @ts-ignore
  return typedClass;
}
