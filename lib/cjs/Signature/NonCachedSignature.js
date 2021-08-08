"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonCachedSignature = void 0;
const AbstractSignature_1 = require("./AbstractSignature");
class NonCachedSignature extends AbstractSignature_1.AbstractSignature {
    entities;
    listEntities() {
        return this.engine.listEntities().filter(this.includesEntity);
    }
}
exports.NonCachedSignature = NonCachedSignature;
