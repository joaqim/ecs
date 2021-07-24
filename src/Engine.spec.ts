import { Signature, SignatureBuilder } from "Signature";
import { Engine, EngineEntityListener } from "./Engine";
import { Entity } from "./Entity";
import { System } from "./System";
import { Component } from "./Component";
import { Base, Model } from "Reflect";

class MockSystem extends System {
  update(engine: Engine, delta: number): void {}
}
@Model("LogComponent")
class LogComponent extends Base<LogComponent> {}

class LogEntityListener implements EngineEntityListener {
  onEntityAdded(entity: Entity): void {
    //console.log("Entity added: " + entity.id);
  }
  onEntityRemoved(entity: Entity): void {
    //console.log("Entity removed: " + entity.id);
  }
}

class LogEntitySystem extends System {
  signature: Signature;
  onAttach(engine: Engine) {
    super.onAttach(engine);
    this.signature = new SignatureBuilder(engine).include(LogComponent).build();
  }

  update(engine: Engine, delta: number): void {
    for (let entity of this.signature.entities) {
      //console.log("Entity updated: " + entity.id);
    }
  }
}

describe("Engine >>>", () => {
  let engine: Engine;
  let entity: Entity;
  let logListener: LogEntityListener;
  let logSystem: LogEntitySystem;

  const delta = 0;
  it("Can be constructed with payload", () => {
    entity = new Entity({
      id: "entity",
      components: {
        LogComponent: new LogComponent(),
        classes: { LogComponent },
      },
    });

    logSystem = new LogEntitySystem();
    logListener = new LogEntityListener();

    let spyListenerAdd = jest.spyOn(logListener, "onEntityAdded");
    let spyListenerRemove = jest.spyOn(logListener, "onEntityRemoved");

    let spySystemAttach = jest.spyOn(logSystem, "onAttach");
    let spySystemDetach = jest.spyOn(logSystem, "onDetach");
    let spySystemUpdate = jest.spyOn(logSystem, "update");

    engine = new Engine({
      entityMap: {
        entities: [new Entity({ id: "uuid" }), entity],
        listeners: [logListener],
      },
      systems: [new MockSystem(), logSystem],
    });

    expect(spyListenerAdd).toHaveBeenCalledTimes(2);

    expect(spySystemAttach).toHaveBeenCalledTimes(0);
    engine.awake();
    expect(spySystemAttach).toHaveBeenCalledTimes(1);

    engine.update(delta);
    expect(spySystemUpdate).toHaveBeenCalledWith(engine, delta);
    expect(spySystemUpdate).toHaveBeenCalledTimes(1);

    engine.removeEntity(entity);
    expect(spyListenerRemove).toHaveBeenCalledWith(entity);
    expect(spyListenerRemove).toHaveBeenCalledTimes(1);

    engine.removeSystem(logSystem);
    expect(spySystemDetach).toHaveBeenCalledWith(engine);
    expect(spySystemDetach).toHaveBeenCalledTimes(1);
  });
});
