import { IComponent, IComponentClass } from "../Component.h";
import { IEngine } from "../Engine";
import { IEntity } from "../Entity";
import { ISignature } from "./Signature.h";
export declare abstract class AbstractSignature implements ISignature {
    readonly engine: IEngine;
    private readonly included;
    private readonly excluded;
    constructor(engine: IEngine, included: IComponentClass<IComponent>[], excluded: IComponentClass<IComponent>[]);
    listEntities(): ReadonlyArray<IEntity>;
    includesEntity: (entity: IEntity) => boolean;
}
