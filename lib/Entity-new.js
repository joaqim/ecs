"use strict";
var Entity_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = exports.PrimedId = exports.PrimedEntities = void 0;
const tslib_1 = require("tslib");
const Reflect_1 = require("./Reflect");
const uuid_1 = require("uuid");
const PrimedEntities = (entities) => {
    if (entities == undefined)
        return [];
    return entities;
};
exports.PrimedEntities = PrimedEntities;
const PrimedId = (id) => {
    if (id == "" || id?.toUpperCase() == "UUID")
        return uuid_1.v4().toString();
    if (id !== undefined && id !== null)
        return id;
};
exports.PrimedId = PrimedId;
let Entity = Entity_1 = class Entity extends Reflect_1.Base {
    classes;
    _id;
    _listeners = [];
    _componentMap;
    get id() {
        return this._id;
    }
    set id(value) {
        if (this._id !== null && this._id !== undefined) {
            throw new Error(`Entity id is already set as "${this._id}".`);
        }
        this._id = value;
    }
    get components() {
        return this._componentMap;
    }
    set components(componentMap) {
        this._componentMap = componentMap;
    }
    isNew() {
        return this._id === null;
    }
    map(fnc) {
        return Object.keys(this.components)
            .filter((key) => key !== "classes")
            .map((i) => fnc(i));
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
        const tag = componentClass.tag || componentClass.name;
        const component = this.components[tag];
        if (!component)
            return false;
        if (!Entity_1.cast(component, componentClass)) {
            throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
        }
        return true;
    }
    getComponent(componentClass) {
        const tag = componentClass.tag || componentClass.name;
        const component = this.components[tag];
        if (!component) {
            throw new Error(`Cannot get component "${tag}" from entity.`);
        }
        if (!Entity_1.cast(component, componentClass)) {
            throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
        }
        return component;
    }
    putComponent(componentClass, payload) {
        const tag = componentClass.tag || componentClass.name;
        const component = this.components[tag];
        if (component) {
            if (tag == "_class" || tag == "Entity") {
                throw new Error(`Component "${tag}" is not a valid component.`);
            }
            if (component instanceof componentClass) {
                throw new Error(`Component "${tag}" is already defined in Entity`);
            }
            if (!Entity_1.cast(component, componentClass)) {
                throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
            }
            delete this.components[tag];
            delete this.components.classes[tag];
        }
        const newComponent = new componentClass(payload);
        this.components[tag] = newComponent;
        this.components.classes[tag] = componentClass;
        for (const listener of this._listeners) {
            listener.onEntityChanged(this);
        }
        return newComponent;
    }
    removeComponent(componentClass) {
        const tag = componentClass.tag || componentClass.name;
        const component = this.components[tag];
        if (!component) {
            throw new Error(`Component of tag "${tag}".\nDoes not exists.`);
        }
        if (!Entity_1.cast(component, componentClass)) {
            throw new Error(`There are multiple classes with the same tag or name "${tag}".\nAdd a different property "tag" to one of them.`);
        }
        delete this.components[tag];
        for (const listener of this._listeners) {
            listener.onEntityChanged(this);
        }
    }
    static cast(component, componentClass) {
        return !!(component && component instanceof componentClass);
    }
    addListener(listener) {
        const index = this._listeners.indexOf(listener);
        if (index === -1) {
            this._listeners.push(listener);
        }
        return this;
    }
    removeListener(listener) {
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
        return this;
    }
};
tslib_1.__decorate([
    Reflect_1.Primed(exports.PrimedId, { required: false })
], Entity.prototype, "id", null);
tslib_1.__decorate([
    Reflect_1.Primed(PrimedComponentMap)
], Entity.prototype, "components", null);
Entity = Entity_1 = tslib_1.__decorate([
    Reflect_1.Model("Entity")
], Entity);
exports.Entity = Entity;
