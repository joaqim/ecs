import { IEngine, System } from ".";
import { ComponentType } from "./Component.h";
import { Position, Renderable } from "./Component.mock";
import { EntityConfig } from "./Entity.h";

interface ISystem<TEntity> {
  includesEntity(entity: TEntity): boolean;
  listEntities(): ReadonlyArray<TEntity>;
}

class BaseSystem<TEntity> {
  entities: TEntity[];
  include: ComponentType[];
  exclude: ComponentType[];
}

type Constructor<T> = { new (...args: any[]): T };
type SystemConfig<T> = T extends BaseSystem<infer TProperties>
  ? {
      type: Constructor<T>;
      id?: string;
      entity?: string;
    } & TProperties
  : never;

/*
function System<TEntity>(): Constructor<BaseSystem<TEntity>> {
  //type TEntity = EntityConfig<TInclude>;
  return class TypedSystem implements ISystem<TEntity> {
    includesEntity(entity: TEntity): boolean {
      throw new Error("Method not implemented.");
    }
    listEntities(): readonly TEntity[] {
      throw new Error("Method not implemented.");
    }
    entities: TEntity[];
    include: ComponentType[];
    exclude: ComponentType[];
  };
}
*/

function createSystem<T extends { readonly [K in keyof object]: any }>(
  definition: SystemConfig<T>
): any {}

//class RenderSystem extends System(EntityConfig<{ position: Position }>) { }
