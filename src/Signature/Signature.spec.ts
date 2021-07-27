import { SignatureBuilder } from "Signature";
import { Engine } from "Engine";
import { Entity } from "Entity";
import { Base, Model } from "Reflect";

@Model
class MyComponent extends Base<MyComponent> {}

@Model
class MyOtherComponent extends Base<MyComponent> {}

describe("Signatures work", function () {
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
    entity.putComponent(MyComponent);
    entity.putComponent(MyOtherComponent);
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
    entity.putComponent(MyComponent);
    engine.addEntities(entity, new Entity());
    const builder = new SignatureBuilder(engine);
    builder.exclude(MyComponent);
    const signature = builder.build();
    expect(signature.listEntities().indexOf(entity)).toEqual(-1);
    expect(signature.listEntities().length).not.toEqual(engine.entities.length);
    expect(signature.listEntities().length).not.toEqual(0);
  });
});
