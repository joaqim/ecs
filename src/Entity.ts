/* eslint-disable class-methods-use-this, max-classes-per-file */
import type { EntityConfig, IEntity } from "./Entity.h";

export class BaseEntity<TProperties extends {} = {}> implements IEntity {
  id?: string | undefined;

  tags?: string[] | undefined;

  // c: { [key: string]: any };
  c: { [key: string]: any };

  properties: TProperties;
}

export function createEntityTypesafe<
  T extends { readonly [K in keyof object]: any }
>(_definition: EntityConfig<T>): void {} // eslint-disable-line @typescript-eslint/no-unused-vars

export function createEntity<T extends { readonly [K in keyof object]: any }>(
  definition: EntityConfig<T>
): any {
  return definition;
}

export function createEntityWithConfig<
  T extends { readonly [K in keyof object]: any }
>(definition: EntityConfig<T>): any {
  return definition;
}

export function CreateEntityClass<
  T extends { readonly [K in keyof object]: any }
>(definition: EntityConfig<T>): any {
  return class extends BaseEntity<EntityConfig<T>> {
    type: EntityConfig<T>;
  };
}

type Constructor<T> = { new (...args: any[]): T };
export function Entity<TProperties extends {}>(
  properties?: TProperties
): Constructor<BaseEntity<TProperties>> &
  Constructor<BaseEntity & TProperties> {
  // @ts-ignore
  const typedClass = class TypedEntity extends Entity {}; // eslint-disable-line @typescript-eslint/no-shadow
  // @ts-ignore
  typedClass.properties = { ...properties };
  // @ts-ignore
  return typedClass;
}
