"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureBuilder = void 0;
class AbstractSignature {
    _engine;
    _include;
    _exclude;
    constructor(engine, include, exclude) {
        this._engine = engine;
        this._include = Object.freeze(include.slice(0));
        this._exclude = Object.freeze(exclude.slice(0));
    }
    get engine() {
        return this._engine;
    }
    includesEntity = (entity) => {
        for (const include of this._include) {
            if (!entity.hasComponent(include)) {
                return false;
            }
        }
        for (const exclude of this._exclude) {
            if (entity.hasComponent(exclude)) {
                return false;
            }
        }
        return true;
    };
}
class CachedSignature extends AbstractSignature {
    _needEntityRefresh;
    _entities;
    constructor(engine, include, exclude) {
        super(engine, include, exclude);
        const allEntities = this.engine.entities;
        this._entities = allEntities.filter(this.includesEntity);
        this.engine.addEntityListener(this);
        for (const entity of allEntities) {
            entity.addListener(this);
        }
        this._needEntityRefresh = false;
    }
    get entities() {
        if (this._needEntityRefresh) {
            this._needEntityRefresh = false;
            this._entities = this._entities.filter(this.includesEntity);
        }
        return Object.freeze(this._entities.slice(0));
    }
    onEntityAdded(entity) {
        const index = this._entities.indexOf(entity);
        if (index === -1) {
            this._entities.push(entity);
            this._needEntityRefresh = true;
            entity.addListener(this);
        }
    }
    onEntityRemoved(entity) {
        const index = this._entities.indexOf(entity);
        if (index !== -1) {
            const entity = this._entities[index];
            this._entities.splice(index, 1);
            entity.removeListener(this);
        }
    }
    onEntityChanged() {
        this._needEntityRefresh = true;
    }
}
class NonCachedSignature extends AbstractSignature {
    get entities() {
        return this.engine.entities.filter(this.includesEntity);
    }
}
class SignatureBuilder {
    _engine;
    _cached;
    _include;
    _exclude;
    constructor(engine) {
        this._engine = engine || null;
        this._include = [];
        this._exclude = [];
        this._cached = true;
    }
    include(...classes) {
        this._include.push(...classes);
        return this;
    }
    exclude(...classes) {
        this._exclude.push(...classes);
        return this;
    }
    changeEngine(engine) {
        this._engine = engine;
        return this;
    }
    setCached(cached) {
        this._cached = cached;
    }
    build() {
        if (!this._engine) {
            throw new Error("Signature should always belong to an engine.");
        }
        if (!this._cached) {
            return new NonCachedSignature(this._engine, this._include, this._exclude);
        }
        return new CachedSignature(this._engine, this._include, this._exclude);
    }
}
exports.SignatureBuilder = SignatureBuilder;
//# sourceMappingURL=Signature.js.map