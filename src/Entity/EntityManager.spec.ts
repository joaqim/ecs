import { Entity } from "Entity";
import { EntityHandle } from "./EntityHandle";
import { EntityManager } from "./EntityManager";

describe("EntityManager >>>", () => {
  let manager: EntityManager;
  let handle: EntityHandle;
  it("can create EntityHandle", () => {
    manager = new EntityManager();
    let e = manager.newEntity({ id: "Test" });
    handle = new EntityHandle(e.id, manager);
    expect(handle.valid());
    expect(e.id).toBe("Test");
    expect(handle.entity.id).toBe(e.id);
    expect(manager.hasEntity(e.id)).toBeTruthy();
    expect(manager.getEntity(e.id)!).toBe(e.entity);
  });
});
