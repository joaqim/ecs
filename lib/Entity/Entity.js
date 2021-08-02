"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = exports.PrimedId = exports.PrimedEntities = void 0;
const tslib_1 = require("tslib");
const Reflect_1 = require("Reflect");
const uuid_1 = require("uuid");
const PrimedEntities = (entities) => {
    if (entities === undefined)
        return [];
    return entities;
};
exports.PrimedEntities = PrimedEntities;
const PrimedId = (id) => {
    if (id === undefined ||
        (typeof id === "string" && (id === "" || id.toUpperCase() === "UUID")))
        return uuid_1.v4().toString();
    return id;
};
exports.PrimedId = PrimedId;
function componentCast(component, ComponentCtor) {
    return !!(component && component instanceof ComponentCtor);
}
const PrimedComponentMap = (components) => {
    if (components === undefined)
        return { classes: {} };
    Object.keys(components).forEach((tag) => {
        if (tag === "classes")
            return;
        if (Object.prototype.hasOwnProperty.call(components, tag)) {
            const ComponentCtor = components.classes[tag];
            if (ComponentCtor !== undefined) {
                const newComponent = new ComponentCtor(components[tag]);
                if (!componentCast(newComponent, ComponentCtor)) {
                    throw new Error("TODO");
                }
                components[tag] = newComponent;
            }
            else {
                throw new Error(`Missing "${tag}" in classes: {} of construction of ComponentMap`);
            }
        }
    });
    return components;
};
let Entity = class Entity extends Reflect_1.Base {
    id;
    listeners = [];
    componentMap;
    set components(componentMap) {
        this.componentMap = componentMap;
    }
    get components() {
        return this.componentMap;
    }
    map(fn) {
        return Object.keys(this.components)
            .filter((key) => key !== "classes")
            .map((i) => fn(i));
    }
    listComponents() {
        return this.map((i) => this.components[i]);
    }
    listComponentsWithTypes() {
        return Object.keys(this.components)
            .filter((key) => key !== "classes")
            .map((i) => ({
            component: this.components[i],
            type: this.components.classes[i],
        }));
    }
    listComponentsWithTags() {
        return Object.keys(this.components)
            .filter((key) => key !== "classes")
            .map((tag) => Object.freeze({
            tag,
            component: this.components[tag],
        }));
    }
    hasComponent(componentClass) {
        const { tag } = componentClass;
        const component = this.components[tag];
        if (!component)
            return false;
        if (!componentCast(component, componentClass)) {
            throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
        }
        return true;
    }
    getComponent(componentClass) {
        const { tag } = componentClass;
        const component = this.components[tag];
        if (!component) {
            throw new Error(`Cannot get component "${tag}" from entity.`);
        }
        if (!componentCast(component, componentClass)) {
            throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
        }
        return component;
    }
    getComponentByTag(tag) {
        const component = this.components[tag];
        const componentClass = this.components.classes[tag];
        if (!component) {
            throw new Error(`Cannot get component "${tag}" from entity.`);
        }
        if (!componentCast(component, componentClass)) {
            throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
        }
        return component;
    }
    putComponent(ComponentCtor, payload) {
        const { tag } = ComponentCtor;
        const component = this.components[tag];
        if (component) {
            if (tag === "_class" || tag === "Entity") {
                throw new Error(`Component "${tag}" is not a valid component.`);
            }
            if (component instanceof ComponentCtor) {
                throw new Error(`Component "${tag}" is already defined in Entity`);
            }
            if (!componentCast(component, ComponentCtor)) {
                throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
            }
            delete this.components[tag];
            delete this.components.classes[tag];
        }
        const newComponent = new ComponentCtor(payload);
        this.components[tag] = newComponent;
        this.components.classes[tag] = ComponentCtor;
        this.listeners.forEach((listener) => listener.onEntityChanged(this));
        return newComponent;
    }
    removeComponent(componentClass) {
        const { tag } = componentClass;
        const component = this.components[tag];
        if (!component) {
            throw new Error(`Component of tag "${tag}".\nDoes not exists.`);
        }
        if (!componentCast(component, componentClass)) {
            throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
        }
        delete this.components[tag];
        this.listeners.forEach((listener) => listener.onEntityChanged(this));
    }
    addListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index === -1) {
            this.listeners.push(listener);
        }
        return this;
    }
    removeListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
        return this;
    }
};
tslib_1.__decorate([
    Reflect_1.Primed(exports.PrimedId, { required: false })
], Entity.prototype, "id", void 0);
tslib_1.__decorate([
    Reflect_1.Primed(PrimedComponentMap)
], Entity.prototype, "components", null);
Entity = tslib_1.__decorate([
    Reflect_1.Model("Entity")
], Entity);
exports.Entity = Entity;
