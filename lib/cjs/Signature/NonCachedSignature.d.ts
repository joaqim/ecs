import type { IEntity } from "../Entity";
import { AbstractSignature } from "./AbstractSignature";
export declare class NonCachedSignature extends AbstractSignature {
    entities: readonly IEntity[];
    listEntities(): ReadonlyArray<IEntity>;
}
