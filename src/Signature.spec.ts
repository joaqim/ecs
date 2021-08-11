interface ISignature<TEntity> {
  includesEntity(entity: TEntity): boolean;
  listEntities(): ReadonlyArray<TEntity>;
}

export class BaseSignature<TProperties extends {} = {}> {
  [key: string]: any;

  tag?: string;

  type: Function;

  properties: TProperties;
}

type Constructor<T> = { new (...args: any[]): T };
export type SignatureConfig<T> = T extends BaseSignature<infer TProperties>
  ? {
      type: Constructor<T>;
      id?: string;
      entity?: string;
    } & TProperties
  : never;

export function Signature<TProperties extends {}>(
  properties?: TProperties
): Constructor<BaseSignature<TProperties>> &
  Constructor<BaseSignature & TProperties> {
  // @ts-ignore
  const typedClass = class TypedSignature extends Signature {}; // eslint-disable-line @typescript-eslint/no-shadow
  // @ts-ignore
  typedClass.properties = { ...properties };
  // @ts-ignore
  return typedClass;
}
