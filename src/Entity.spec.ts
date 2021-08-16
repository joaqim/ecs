import { Flag, Velocity } from "./Component.mock";
import { createEntity } from "./Entity";
import type { IEntity, IEntityChangeListener } from "./Entity.h";
import { EntityConfig } from "./Entity.h";

class EntityChangeListener implements IEntityChangeListener {
  onEntityChanged(entity: IEntity): void {}
}

class EntityFlagListener
  implements IEntityChangeListener<EntityConfig<{ flag: Flag }>>
{
  onEntityChanged(entity: EntityConfig<{ flag: Flag }>): void {
    entity.c.flag;
  }
}

describe(">>> Entity", () => {
  const mock_entity_changed = (entity: IEntity): void => {
    if (entity.listeners) {
      for (let listener of entity.listeners) {
        listener.onEntityChanged(entity);
      }
    }
  };

  it("can use EntityChangeListener as listener with onEntityChanged()", () => {
    let listener_entity = new EntityChangeListener();
    let listener_flag = new EntityFlagListener();

    let spyListenerEntity = jest.spyOn(listener_entity, "onEntityChanged");
    let spyListenerFlag = jest.spyOn(listener_flag, "onEntityChanged");

    const entity: IEntity = {
      id: "0",
      listeners: [listener_entity, listener_flag],
      c: { flag: { type: Flag } },
    };

    mock_entity_changed(entity);

    expect(spyListenerEntity).toHaveBeenCalledTimes(1);
    expect(spyListenerFlag).toHaveBeenCalledTimes(1);
    expect(spyListenerEntity).toHaveBeenCalledWith(entity);
    expect(spyListenerFlag).toHaveBeenCalledWith(entity);

    entity.listeners = [listener_entity];
    mock_entity_changed(entity);

    expect(spyListenerEntity).toHaveBeenCalledTimes(2);
    expect(spyListenerFlag).toHaveBeenCalledTimes(1);

    entity.listeners = [listener_flag];
    mock_entity_changed(entity);

    expect(spyListenerEntity).toHaveBeenCalledTimes(2);
    expect(spyListenerFlag).toHaveBeenCalledTimes(2);
  });
  it("", () => {
    let e: IEntity = createEntity({ id: "0", c: { flag: { type: Flag } } });
    type T = EntityConfig<{ flag: Flag }>;
    let n: T;
    n = createEntity({ id: "0", c: { flag: { type: Flag } } });
    n.c.flag;
    expect(e).toEqual(n as IEntity);
    n = e as T;
    expect(n).toEqual(e);
  });
});
