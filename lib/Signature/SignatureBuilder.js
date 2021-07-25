"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CachedSignature_1 = tslib_1.__importDefault(require("./CachedSignature"));
const NonCachedSignature_1 = tslib_1.__importDefault(require("./NonCachedSignature"));
class SignatureBuilder {
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
            return new NonCachedSignature_1.default(this.engine, this.included, this.excluded);
        }
        return new CachedSignature_1.default(this.engine, this.included, this.excluded);
    }
}
exports.default = SignatureBuilder;
