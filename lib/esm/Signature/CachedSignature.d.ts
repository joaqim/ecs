import { IComponent, IComponentClass } from "../Component.h";
import { IEngine } from "../Engine";
import { IEntity, IEntityChangeListener } from "../Entity";
import { AbstractSignature } from "./AbstractSignature";
export declare class CachedSignature extends AbstractSignature implements IEntityChangeListener {
    private needEntityRefresh;
    entities: IEntity[];
    constructor(engine: IEngine, include: IComponentClass<IComponent>[], exclude: IComponentClass<IComponent>[]);
    listEntities(): readonly IEntity[];
    onEntityAdded(entity: IEntity): void;
    onEntityRemoved(entity: IEntity): void;
    onEntityChanged(): void;
}
