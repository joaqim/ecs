import { IEntity } from "Entity";
import { ISystem } from "System";

export interface IEngineEntityListener {
  onEntityAdded(entity: IEntity): void;
  onEntityRemoved(entity: IEntity): void;
}

export type EntityMap = {
  /** Public array containing the current list of added entities. */
  entities: IEntity[];
  /** Public list of entity listeners */
  listeners: IEngineEntityListener[];
};

export interface IEngine {
  systems: ISystem[];
  entityMap: EntityMap;

  awake(): IEngine;
  update(delta: number): any;
  removeEntity(entity: IEntity): void;
  removeEntities(...entities: IEntity[]): void;

  addSystem(system: ISystem): void;
  addSystems(...systems: ISystem[]): void;
  removeSystem(system: ISystem): void;
  removeSystems(...system: ISystem[]): void;

  listEntities(): ReadonlyArray<IEntity>;
  notifyPriorityChange(system: ISystem): void;

  addEntityListener(listener: IEngineEntityListener): void;
  removeEntityListener(listener: IEngineEntityListener): void;
}
