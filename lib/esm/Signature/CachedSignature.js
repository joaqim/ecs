import { AbstractSignature } from "./AbstractSignature";
export class CachedSignature extends AbstractSignature {
    needEntityRefresh;
    entities;
    constructor(engine, include, exclude) {
        super(engine, include, exclude);
        const allEntities = this.engine.listEntities();
        this.entities = allEntities.filter(this.includesEntity);
        this.engine.addEntityListener(this);
        allEntities.forEach((entity) => entity.addListener(this));
        this.needEntityRefresh = false;
    }
    listEntities() {
        if (this.needEntityRefresh) {
            this.needEntityRefresh = false;
            this.entities = this.entities.filter(this.includesEntity);
        }
        return Object.freeze(this.entities.slice(0));
    }
    onEntityAdded(entity) {
        const index = this.entities.indexOf(entity);
        if (index === -1) {
            this.entities.push(entity);
            this.needEntityRefresh = true;
            entity.addListener(this);
        }
    }
    onEntityRemoved(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            const removedEntity = this.entities[index];
            this.entities.splice(index, 1);
            removedEntity.removeListener(this);
        }
    }
    onEntityChanged() {
        this.needEntityRefresh = true;
    }
}
