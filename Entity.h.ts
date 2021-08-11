type Constructor<T> = { new (...args: any[]): T };
export type ComponentConfig<T> = T extends BaseComponent<infer TProperties>
  ? {
      type: Constructor<T>;
      id?: string;
      entity?: string;
    } & TProperties
  : never;

export type EntityConfig<
  TComponents extends { readonly [K in keyof object]: any }
> = {
  id?: string;
  tags?: string[];
  c: {
    [K in keyof TComponents]: ComponentConfig<TComponents[K]>;
  };
};

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

export function createEntityTypesafe<
  T extends { readonly [K in keyof object]: any }
>(_definition: EntityConfig<T>): void {} // eslint-disable-line @typescript-eslint/no-unused-vars

export function createEntity<T extends { readonly [K in keyof object]: any }>(
  definition: EntityConfig<T>
): void {}
