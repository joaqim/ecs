"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AbstractSignature_1 = tslib_1.__importDefault(require("./AbstractSignature"));
class NonCachedSignature extends AbstractSignature_1.default {
    entities;
    listEntities() {
        return this.engine.listEntities().filter(this.includesEntity);
    }
}
exports.default = NonCachedSignature;
