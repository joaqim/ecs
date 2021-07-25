import { IEntity } from "Entity";
import AbstractSignature from "./AbstractSignature";
export default class NonCachedSignature extends AbstractSignature {
    entities: readonly IEntity[];
    listEntities(): ReadonlyArray<IEntity>;
}
