import type { IComponent, IComponentClass } from "../Component.h";
import type { IEngine } from "../Engine";
import type { IEntity } from "../Entity";
import type { ISignature } from "./Signature.h";
export declare abstract class AbstractSignature implements ISignature {
    readonly engine: IEngine;
    private readonly included;
    private readonly excluded;
    constructor(engine: IEngine, included: IComponentClass<IComponent>[], excluded: IComponentClass<IComponent>[]);
    listEntities(): ReadonlyArray<IEntity>;
    includesEntity: (entity: IEntity) => boolean;
}
