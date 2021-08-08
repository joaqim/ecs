import { IEntity } from "../Entity";
export interface ISignature {
    includesEntity(entity: IEntity): boolean;
    listEntities(): ReadonlyArray<IEntity>;
}
