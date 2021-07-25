"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractSignature {
    engine;
    included;
    excluded;
    constructor(engine, included, excluded) {
        this.engine = engine;
        this.included = Object.freeze(included.slice(0));
        this.excluded = Object.freeze(excluded.slice(0));
    }
    listEntities() {
        return this.engine.listEntities().filter(this.includesEntity);
    }
    includesEntity = (entity) => {
        for (const include of this.included) {
            if (!entity.hasComponent(include)) {
                return false;
            }
        }
        for (const exclude of this.excluded) {
            if (entity.hasComponent(exclude)) {
                return false;
            }
        }
        return true;
    };
}
exports.default = AbstractSignature;
