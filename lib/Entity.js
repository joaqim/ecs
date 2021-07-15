var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Entity_1;
import { Base, Model, Primed } from "./Reflect";
import { PrimedComponents, } from "./Component";
import { v4 as uuidv4 } from "uuid";
export const PrimedEntities = (entities) => {
    if (entities == undefined)
        return [];
    return entities;
};
export const PrimedId = (id) => {
    if (id !== undefined && id !== null)
        return id;
    return uuidv4();
};
let Entity = Entity_1 = class Entity extends Base {
    constructor() {
        super(...arguments);
        this._listeners = [];
    }
    get id() {
        return this._id;
    }
    set id(value) {
        if (value === null || value === undefined) {
            throw new Error(`Must set a non null value when setting an entity id.`);
        }
        if (this._id !== null) {
            throw new Error(`Entity id is already set as "${this._id}".`);
        }
        this._id = value;
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
__decorate([
    Primed(PrimedId, { required: false })
], Entity.prototype, "_id", void 0);
__decorate([
    Primed(PrimedComponents)
], Entity.prototype, "components", void 0);
Entity = Entity_1 = __decorate([
    Model("Entity")
], Entity);
export { Entity };
//# sourceMappingURL=Entity.js.map