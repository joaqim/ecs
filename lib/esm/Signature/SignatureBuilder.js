import { CachedSignature } from "./CachedSignature";
import { NonCachedSignature } from "./NonCachedSignature";
export class SignatureBuilder {
    engine;
    cached;
    included;
    excluded;
    constructor(engine) {
        this.engine = engine || null;
        this.included = [];
        this.excluded = [];
        this.cached = true;
    }
    include(...classes) {
        this.included.push(...classes);
        return this;
    }
    exclude(...classes) {
        this.excluded.push(...classes);
        return this;
    }
    changeEngine(engine) {
        this.engine = engine;
        return this;
    }
    setCached(cached) {
        this.cached = cached;
    }
    build() {
        if (!this.engine) {
            throw new Error("Signature should always belong to an engine.");
        }
        if (!this.cached) {
            return new NonCachedSignature(this.engine, this.included, this.excluded);
        }
        return new CachedSignature(this.engine, this.included, this.excluded);
    }
}
