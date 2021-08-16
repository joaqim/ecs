import type { ComponentConfig } from "./Component";

export class BaseEntity<TProperties extends {} = {}> {
  properties: TProperties;
}

export interface IEntity {
  id?: string;
  tags?: string[];
  c: {
    [key: string]: any;
  };
}

export type EntityConfig<
  TComponents extends { readonly [K in keyof object]: any }
> = {
  id?: string;
  tags?: string[];
  c: {
    [K in keyof TComponents]: ComponentConfig<TComponents[K]>;
  };
};
