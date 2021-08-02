import { Base, Model } from "Reflect";
import { EntityHandle } from "./EntityHandle";
import { EntityManager } from "./EntityManager";

@Model
class TestComponent extends Base<TestComponent> {}

describe("EntityManager >>>", () => {
  let manager = new EntityManager();
  let handle: EntityHandle;

  const UUID_LENGTH = 36;

  it("can create EntityHandle", () => {
    handle = manager.newEntity({ id: "Test" });
    let e = manager.getEntity("Test")!;
    expect(handle.entity).toEqual(e);

    expect(handle).toEqual(new EntityHandle(e.id, manager));
    expect(handle.valid());
    expect(e.id).toBe("Test");
    expect(handle.entity.id).toBe(e.id);
    expect(manager.hasEntity(e.id)).toBeTruthy();
    expect(manager.getEntity(e.id)!).toBe(handle.entity);
  });

  it("can construct with provided EntityId ( string | number ) or UUID", () => {
    handle = manager.newEntity();

    expect(handle.id.length).toBe(UUID_LENGTH);
  });

  it("can create entity with components", () => {
    handle = manager.newEntity({
      id: "Test",
      components: {
        TestComponent: {},
        classes: { TestComponent },
      },
    });

    expect(handle.entity.getComponent(TestComponent)).toEqual(
      {} as TestComponent
    );

    expect(handle.id).toBe("Test");
  });
});
