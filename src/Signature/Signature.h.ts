import { IEntity } from "../Entity";

/**
 * A signature is a criteria to separate your entities.
 * You can have signatures on wich entities must have a component,
 * entities cannot have some components or a mix of both.
 * Signatures also cache the entities of the engine by default,
 * so you won't have to worry about filtering entities every time.
 */
export interface ISignature {
  /**
   * Computes a list of entities on the signature.
   * The list may or may not be cached, depending of implementation.
   */
  includesEntity(entity: IEntity): boolean;
  listEntities(): ReadonlyArray<IEntity>;
}
