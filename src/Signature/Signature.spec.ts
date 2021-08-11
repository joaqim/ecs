import { CachedSignature, SignatureBuilder } from "../Signature";
import { Engine } from "../Engine";
import { Component } from "../Component";
import { EntityConfig } from "../Entity.h";

class MyComponent extends Component({ value: "" }) {}
class MyOtherComponent extends Component({}) {}

type MyEntityType = EntityConfig<{ mc: MyComponent }>;
class MyEntity extends Entity({ mc: MyComponent }) {}

export class BaseSignature<T> {}

describe("Signatures work", function () {
  it("", () => {
    let engine = new Engine();
    let entity = new MyEntity({ c: {} });
    /*
    let sig1 = new CachedSignature<MyEntity>(
      engine,
      [MyComponent],
      [MyOtherComponent]
    );
    */

    let e: MyEntity;
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
