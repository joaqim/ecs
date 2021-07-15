import { Entity } from "./Entity";
export const PrimedComponents = (components) => {
    if (components === undefined)
        return { classes: {} };
    for (const tag in components) {
        if (tag === "classes")
            continue;
        if (Object.prototype.hasOwnProperty.call(components, tag)) {
            const componentClass = components.classes[tag];
            if (componentClass !== undefined) {
                const newComponent = new componentClass(components[tag]);
                if (!Entity.cast(newComponent, componentClass)) {
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
//# sourceMappingURL=Component.js.map