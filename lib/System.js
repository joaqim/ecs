"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.System = exports.PrimedSystems = void 0;
const PrimedSystems = (systems) => {
    if (systems === undefined)
        return [];
    return systems;
};
exports.PrimedSystems = PrimedSystems;
class System {
    _priority;
    _engines;
    constructor() {
        this._priority = 0;
        this._engines = [];
    }
    get priority() {
        return this._priority;
    }
    set priority(value) {
        this._priority = value;
        for (const engine of this._engines) {
            engine.notifyPriorityChange(this);
        }
    }
    get engines() {
        return Object.freeze(this._engines.slice(0));
    }
    onAttach(engine) {
        const index = this._engines.indexOf(engine);
        if (index === -1) {
            this._engines.push(engine);
        }
    }
    onDetach(engine) {
        const index = this._engines.indexOf(engine);
        if (index !== -1) {
            this._engines.splice(index, 1);
        }
    }
}
exports.System = System;
//# sourceMappingURL=System.js.map