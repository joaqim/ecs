"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimedComponents = void 0;
const Entity_1 = require("./Entity");
const PrimedComponents = (components) => {
    if (components === undefined)
        return { classes: {} };
    for (const tag in components) {
        if (tag === "classes")
            continue;
        if (Object.prototype.hasOwnProperty.call(components, tag)) {
            const componentClass = components.classes[tag];
            if (componentClass !== undefined) {
                const newComponent = new componentClass(components[tag]);
                if (!Entity_1.Entity.cast(newComponent, componentClass)) {
                    throw new Error(``);
                }
                components[tag] = newComponent;
            }
            else {
                throw new Error(`Missing "${tag}" in classes: {} in construction of Components`);
            }
        }
    }
    return components;
};
exports.PrimedComponents = PrimedComponents;
