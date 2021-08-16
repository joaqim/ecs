import type { IComponent } from "./Component.h";
import { ComponentConfig } from "./Component";
import { createEntity, CreateEntityClass } from "./Entity";
import {
  BaseSystem,
  Flag,
  Velocity,
  Circle,
  Position,
  Shape,
  Renderable,
} from "./Component.mock";
import type { EntityConfig, IEntity } from "./Entity.h";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

function createComponent<T extends { readonly [K in keyof object]: any }>(
  definition: ComponentConfig<T>
): ComponentConfig<T> {
  return definition;
}

function hasComponent(entity: IEntity, component: Function): boolean {
  return Object.prototype.hasOwnProperty.call(
    entity.c,
    component.name.toLowerCase()
  );
}

function getComponent(entity: IEntity, component: Function): any {
  const result = Object.entries(entity.c).find((c: any) => {
    return c[1].type === component;
  });
  return result ? result[1] : undefined;
}

function addComponent<T extends { readonly [K in keyof object]: any }>(
  entity: IEntity,
  definition: ComponentConfig<T>
) {
  const key = definition.type.name.toLowerCase();
  entity.c = { ...entity.c, [key]: definition };
}

// type RenderEntity = EntityConfig<typeof Renderable>;
export function toInstanceOfMyClassOf<T>() {
  type MyEntity = EntityConfig<T>;

  return class {
    public entities: MyEntity[] = [];
    public entity: MyEntity;
    public listEntities(): MyEntity[] {
      return this.entities;
    }
  };
}

class SystemInstance extends toInstanceOfMyClassOf<{ flag: Flag }>() {
  init() {
    console.log(this);
  }
}

describe(">>> TypedComponent", () => {
  let entity: EntityConfig<{
    flag: Flag;
    velocity: Velocity;
    circle: Circle;
  }>;

  let ent2: any;
  let c1: ComponentConfig<Flag>;

  let flag: IComponent = new Flag({});

  let ie: IEntity;

  it("", () => {
    type Ent = EntityConfig<{ flag: Flag }>;
    let e: Ent = { c: { flag: { type: Flag } } };
    let sys = new SystemInstance();
    sys.entities = [{ c: { flag: { type: Flag } } }];
  });
  it("", () => {
    entity = createEntity({
      id: "id",
      c: {
        flag: { type: Flag },
        velocity: {
          type: Velocity,
          dx: 0,
          dy: 0,
        },
        circle: {
          type: Circle,
          x: 1,
          y: 1,
          r: 0,
        },
      },
    });
    // console.log({ entity });

    const { flag, velocity } = entity.c;

    expect(flag.type).toBe(Flag);
    expect(velocity.dx).toBe(0);

    expect(entity.c.circle.r).toEqual(0);

    // console.log(createComponent({ type: Velocity, dx: 1, dy: 1 }));

    ent2 = createEntity({ c: { flag: { type: Flag } } });
    //c1 = createComponent({ type: Circle, x: 0, y: 0, r: 0 });

    expect(hasComponent(ent2, Flag)).toBeTruthy();
    // console.log(getComponent(ent2, Flag));

    const ent3 = createEntity({
      c: { vel: { type: Velocity, dx: 10, dy: 10 } },
    });

    /*
    expect(getComponent(ent3, Velocity)).toBe(ent3.c.vel);
    addComponent(ent3, { type: Circle, x: 1, y: 1, r: 10 });
    console.log(ent3);
    */
  });

  it("", () => {
    const e1 = createEntity({ id: "Include", c: { flag: { type: Flag } } });
    const e2 = createEntity({ id: "Just happy to be here", c: {} });
    const e3 = createEntity({
      id: "Exclude",
      c: { flag: { type: Flag }, vel: { type: Velocity, dx: 0, dy: 0 } },
    });

    createEntity({ c: { flag: { type: Velocity, dx: 2, dy: 2 } } });

    const included = [Flag]; // Must include these components
    const excluded = [Velocity]; // Excludes any matching component
    const entities = [e1, e2];

    let sys_comp_type: ComponentConfig<{ flag: Flag; exclude: [Velocity] }>;

    function includesEntity(entity: IEntity): boolean {
      return (
        (!excluded.some((exclude: Function) => {
          return Object.prototype.hasOwnProperty.call(
            entity.c,
            exclude.name.toLowerCase()
          );
        }) &&
          included.every((include: Function) => {
            return Object.prototype.hasOwnProperty.call(
              entity.c,
              include.name.toLowerCase()
            );
          })) ||
        false
      );
    }

    const listEntities = (): readonly any[] => {
      return entities.filter(includesEntity);
    };

    console.log(entities.filter(includesEntity));
  });
});
