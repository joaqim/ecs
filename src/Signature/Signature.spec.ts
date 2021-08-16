import { Engine, IEngine } from "../Engine";
import { Component, ComponentConfig } from "../Component";
import { EntityConfig, IEntity } from "../Entity.h";
import { isOfType } from "../utils/isOfType";
import { BaseSystem, Flag, Velocity } from "../Component.mock";
import { ComponentType } from "../Component.h";
import { createEntity, createEntityWithConfig, Entity } from "../Entity";
import { ISignature } from "./Signature.h";
import { SignatureBuilder } from "./SignatureBuilder";
import { CachedSignature } from "./CachedSignature";

class MyComponent extends Component({ value: "" }) {}
class MyOtherComponent extends Component({}) {}
class AnotherFlag extends Component({}) {}

type MyEntityType = EntityConfig<{ mc: MyComponent }>;

type FlagEntity = { flag: Flag };
describe("Signatures work", function () {
  it("", () => {});
  it("", () => {
    let engine = new Engine();
    let flagEntity = createEntity({
      c: { flag: { type: Flag } },
    });
    let velEntity = createEntity({
      c: { flag: { type: Flag }, velocity: { type: Velocity, dx: 0, dy: 0 } },
    });

    engine.addEntity(flagEntity);
    engine.addEntity(velEntity);
    let signature = new SignatureBuilder<FlagEntity>(engine)
      .exclude([Velocity])
      .build();

    let entities = signature.listEntities();
    expect(entities).toHaveLength(1);
    expect(entities[0]).toBe(flagEntity);
    expect(engine.listEntities()).toHaveLength(2);

    /*
    let s = new BaseSignature<{ flag: Flag }>(engine, [Velocity]);
    expect(s.excluded).toEqual([Velocity]);

    s.engineEntities = [
      { c: { flag: { type: Flag } } },
      {
        c: { flag: { type: Flag }, velocity: { type: Velocity, dx: 0, dy: 0 } },
      },
      { c: { velocity: { type: Velocity, dx: 0, dy: 0 } } },
    ];
    s.included = [Flag];

    s.excluded = [];
    expect(s.listEntities()).toHaveLength(2);
    s.excluded = [Velocity];
    expect(s.listEntities()).toHaveLength(1);

    s.entities = [
      { c: { flag: { type: Flag } } },
      { c: { flag: { type: AnotherFlag } } },
    ];
    console.log(...s.entities);
    expect(
      isOfType<{ [key: string]: ComponentType }>(entity.c, "flag")
    ).toBeTruthy();

    type EntityFlagType = EntityConfig<{ flag: Flag }>;
    type EntityAnotherFlagType = EntityConfig<{ fag: AnotherFlag }>;

    let flagEntity: EntityFlagType = createEntity({
      c: { flag: { type: Flag } },
    });
    let anotherFlagEntity: EntityAnotherFlagType = createEntity({
      c: { flag: { type: AnotherFlag } },
    });
    */
  });
  /*
  it("Empty signature returns all entities", function () {
    const engine = new Engine();
    engine.addEntities(new Entity(), new Entity());
    const builder = new SignatureBuilder(engine);
    const signature = builder.build();
    expect(signature.listEntities().length).toEqual(engine.entities.length);
  });
  it("Signatures must always have an Engine attached", function () {
    const builder = new SignatureBuilder();
    expect(() => builder.build()).toThrow();
  });
  it("Signature includes the corresponding entity for inclusion", function () {
    const engine = new Engine();
    const entity = new Entity();
    entity.addComponent({ type: MyComponent, value: "value" });
    entity.addComponent({ type: MyOtherComponent });
    engine.addEntities(entity, new Entity());
    const builder = new SignatureBuilder(engine);
    builder.include(MyComponent, MyOtherComponent);
    const signature = builder.build();
    expect(signature.listEntities().indexOf(entity)).not.toEqual(-1);
    expect(signature.listEntities().length).not.toEqual(engine.entities.length);
    expect(signature.listEntities().length).not.toEqual(0);
  });
  it("Signature includes the corresponding entity for exclusion", function () {
    const engine = new Engine();
    const entity = new Entity();
    entity.addComponent({ type: MyComponent, value: "value" });
    engine.addEntities(entity, new Entity());
    const builder = new SignatureBuilder(engine);
    builder.exclude(MyComponent);
    const signature = builder.build();
    expect(signature.listEntities().indexOf(entity)).toEqual(-1);
    expect(signature.listEntities().length).not.toEqual(engine.entities.length);
    expect(signature.listEntities().length).not.toEqual(0);
  });
  it("Signature can update entity component values", () => {
    const engine = new Engine();
    const entity = new Entity();
    entity.addComponent({ type: MyComponent, value: "value" });
    engine.addEntity(entity);
    const signature = new SignatureBuilder(engine).include(MyComponent).build();

    expect(entity.getComponent(MyComponent)).toEqual("value");
    entity.getComponent(MyComponent).value = "new value";
    expect(entity.getComponent(MyComponent)).toEqual("new value");
    //(entity.getComponent(MyComponent) as MyComponent).value = "TEST";
    //expect((entity.getComponent(MyComponent) as MyComponent).value).toEqual( "TEST");
  });
  */
});
