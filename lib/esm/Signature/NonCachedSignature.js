import { AbstractSignature } from "./AbstractSignature";
export class NonCachedSignature extends AbstractSignature {
    entities;
    listEntities() {
        return this.engine.listEntities().filter(this.includesEntity);
    }
}
