import { Base, Model } from "./Reflect";
import { Entity } from "./Entity";

@Model
class MyComponent extends Base<MyComponent> {
  val1 = "";
  val2 = "";
}

namespace BadTag {
  @Model
  export class MyComponent extends Base<MyComponent> {}
}

describe("Entities work", function () {
  it("Can only set id once", function () {
    const entity = new Entity();
    expect(entity.id).toBeNull();
    expect(() => {
      entity.id = "testing id";
    }).not.toThrow();

    expect(() => (entity.id = "other id")).toThrow();
    expect(entity.id).not.toEqual("other id");
  });
  it("Can retrieve id when set for the first time", function () {
    const entity = new Entity();
    expect(entity.id).toBeNull();
    expect(() => (entity.id = "testing id")).not.toThrow();
    expect(() => entity.id).not.toThrow();
    expect(entity.id).toEqual("testing id");
  });
  it("Can add a component.", function () {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).toBeInstanceOf(MyComponent);
    expect(() => entity.hasComponent(MyComponent)).not.toThrow();
  });
  it("Can only add one unique component class.", function () {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).toBeInstanceOf(MyComponent);
    //expect(() => entity.putComponent(MyComponent)).toThrow(); TODO
  });
  it("Can add a component with multiple arguments.", function () {
    const entity = new Entity();
    entity.putComponent(MyComponent, { val1: "Value1", val2: "Value2" });
    expect(entity.getComponent(MyComponent)).toBeDefined();
    expect(entity.getComponent(MyComponent).val1).toBe("Value1");
    expect(entity.getComponent(MyComponent).val2).toBe("Value2");
  });
  it("Can create Entity with reflection", () => {
    const entity = new Entity({
      id: "entity",
      components: {
        MyComponent: <MyComponent>{
          val1: "Value1",
          val2: "Value2",
        },
        classes: { MyComponent },
      },
    });

    expect(entity.getComponent(MyComponent)).toBeDefined();
    expect(entity.getComponent(MyComponent).val1).toBe("Value1");
    expect(entity.getComponent(MyComponent).val2).toBe("Value2");
    expect(entity.id).toBe("entity");
  });
  it("ID is either null, custom string or generated UUID", () => {
    expect(new Entity().id).toBeNull();
    expect(new Entity({}).id).toBeNull();
    expect(new Entity({ id: "" }).id).not.toBeNull();
    expect(new Entity({ id: "" }).id.length).toBe(36);
    expect(new Entity({ id: "uuid" }).id.length).toBe(36);
  });
  it("Component tag is correct.", () => {
    expect(MyComponent.tag).toBe("MyComponent");
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).toBeInstanceOf(MyComponent);
    expect(MyComponent.tag).toBe("MyComponent");
    expect(() => entity.getComponent(MyComponent)).not.toThrow();
    expect(() => entity.putComponent(MyComponent)).toThrow();
  });
  it("Throw error when bad class tags override component types.", function () {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).toBeInstanceOf(MyComponent);
    expect(() => entity.putComponent(BadTag.MyComponent)).toThrow();
  });
  it("Remove a component.", function () {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).toBeInstanceOf(MyComponent);
    expect(() => entity.removeComponent(MyComponent)).not.toThrow();
  });
  it("Throw an error when a bad class tag tries to remove a component.", function () {
    const entity = new Entity();
    expect(entity.putComponent(MyComponent)).toBeInstanceOf(MyComponent);
    expect(() => entity.removeComponent(BadTag.MyComponent)).toThrow();
  });
  it("Throw an error when getting a non added component", function () {
    const entity = new Entity();
    expect(() => entity.getComponent(MyComponent)).toThrow();
  });
  it("Throw an error when removing a non added component", function () {
    const entity = new Entity();
    expect(() => entity.removeComponent(MyComponent)).toThrow();
  });
});
