import { Flag, Velocity } from "./Component.mock";
import { createEntity } from "./Entity";
import type { IEntity } from "./Entity.h";
import { EntityConfig } from "./Entity.h";

const TestEntity: IEntity = {
  id: "0",
  c: { flag: { type: Flag } },
};

describe(">>> Entity", () => {
  it("", () => {
    let e: IEntity = createEntity({ id: "0", c: { flag: { type: Flag } } });
    console.log(e);
    expect(e).toEqual(TestEntity);
    type T = EntityConfig<{ flag: Flag }>;
    let n: T;
    n = createEntity({ id: "0", c: { flag: { type: Flag } } });
    n.c.flag;
    expect(e).toEqual(n as IEntity);
    n = e as T;
    console.log(n);
  });
});
