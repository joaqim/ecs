import { Engine } from "./Engine";
import { Entity } from "./Entity";
import { System } from "./System";

class MockSystem extends System {
  update(engine: Engine, delta: number): void {}
}

describe("Engine >>>", () => {
  let engine: Engine;
  it("Can be constructed with payload", () => {
    engine = new Engine({
      entities: [new Entity()],
      systems: [new MockSystem()],
    });
  });
});
