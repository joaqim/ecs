import { Engine, IEngine, IEngineEntityListener } from "./";
import { Entity, IEntity } from "../Entity";
import { Base, Model } from "../Reflect";
import { ISignature, SignatureBuilder } from "../Signature";
import { System } from "../System";

class MockSystem extends System {
  update(engine: IEngine, delta: number): void {}
}

@Model("LogComponent")
class LogComponent extends Base<LogComponent> {}

class LogEntityListener implements IEngineEntityListener {
  onEntityAdded(_entity: IEntity): void {
    //console.log("Entity added: " + entity.id);
  }
  onEntityRemoved(_entity: IEntity): void {
    //console.log("Entity removed: " + entity.id);
  }
}

class LogEntitySystem extends System {
  signature: ISignature;
  onAttach(engine: IEngine) {
    super.onAttach(engine);
    this.signature = new SignatureBuilder(engine).include(LogComponent).build();
  }

  update(engine: IEngine, delta: number): void {
    for (let entity of this.signature.listEntities()) {
      //console.log("Entity updated: " + entity.id);
    }
  }
}

@Model("BoxComponent")
class BoxComponent extends Base<BoxComponent> {
  x: number;
  y: number;
}

class RenderSystem extends System {
  signature: ISignature;
  onAttach(engine: IEngine) {
    super.onAttach(engine);
    this.signature = new SignatureBuilder(engine).include(BoxComponent).build();
  }

  update(engine: IEngine, delta: number): any {
    let elements = {};
    let keyCount = 0;
    for (let entity of this.signature.listEntities()) {
      const box = entity.getComponent(BoxComponent) as BoxComponent;
      elements = {
        ...elements,
        [`${entity.id}_${keyCount.toString()}`]: { ...box },
      };
      keyCount += 1;
    }
    return elements;
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

  it("can use Objects returned from systems update()", () => {
    engine = new Engine({
      entityMap: {
        entities: [
          new Entity({
            id: "BOX",
            components: {
              BoxComponent: new BoxComponent({ x: 100, y: 100 }),
              LogComponent: new LogComponent(),
              classes: { BoxComponent, LogComponent },
            },
          }),
        ],
      },
      systems: [new RenderSystem()],
    });
    engine.awake();
    expect(engine.update(delta)[0]).toEqual({ BOX_0: { x: 100, y: 100 } });
  });
});
