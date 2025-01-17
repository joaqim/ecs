import { Entity } from "./Entity";
import { Base, Model } from "@joaqim/primed-model";

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
  const UUID_LENGTH = 36;

  it("Can retrieve id when set for the first time", function () {
    const entity = new Entity();
    expect(entity.id).not.toBeNull();
    expect(() => entity.id).not.toThrow();
    expect(entity.id).toHaveLength(UUID_LENGTH);
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
    expect((entity.getComponent(MyComponent) as MyComponent).val1).toBe(
      "Value1"
    );
    expect((<MyComponent>entity.getComponent(MyComponent)).val2).toBe("Value2");
  });
  it("Can create Entity with reflection newer", () => {
    const entity = new Entity({
      components: {
        MyComponent: { val1: "VAL1", val2: "VAL2" },
        classes: { MyComponent },
      },
    });
    expect(entity.components.MyComponent).toBeDefined();
    let myComponent = entity.components.MyComponent as MyComponent;
    expect(myComponent.val1).toBe("VAL1");
    expect((entity.getComponent(MyComponent) as MyComponent).val2).toBe("VAL2");
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
    expect((entity.getComponent(MyComponent) as MyComponent).val1).toBe(
      "Value1"
    );
    expect((entity.getComponent(MyComponent) as MyComponent).val2).toBe(
      "Value2"
    );
    expect(entity.id).toBe("entity");
  });
  it("Can create Entity with aliased components", () => {
    /*
    const entity = new Entity({
      id: "entity",
      components: {
        myComponent: <MyComponent>{ val1: "VAL1", val2: "VAL2" },
        classes: { myComponent: MyComponent },
      },
    });

    expect(entity.getComponent(MyComponent)).toBeUndefined();

    expect(entity.components.myComponent).toBeDefined();
    expect((entity.components.myComponent as MyComponent).val1).toBe("VAL1");
    expect((entity.getComponentByTag("myComponent") as MyComponent).val2).toBe(
      "VAL2"
    );

    expect(entity.id).toBe("entity");
    */
  });

  it("ID is either custom string or generated UUID", () => {
    // String
    expect(new Entity({ id: "Test" }).id).toBe("Test");

    // UUID
    expect(new Entity().id).toHaveLength(UUID_LENGTH);
    expect(new Entity({}).id).toHaveLength(UUID_LENGTH);
    expect(new Entity({ id: "" }).id).toHaveLength(UUID_LENGTH);
    expect(new Entity({ id: "uuid" }).id).toHaveLength(UUID_LENGTH);
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
