"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = exports.Primed = exports.Model = exports.PropertyOptions = void 0;
require("reflect-metadata");
const PRIMED_PROPERTIES_META = Symbol("PRIMED_PROPERTIES_META");
const CLASS_NAME_MAPPING = Symbol("CLASS_NAME_MAPPING");
const CLASS_NAME = Symbol("CLASS_NAME");
class PropertyOptions {
    required = true;
    array = false;
}
exports.PropertyOptions = PropertyOptions;
function Model(constructorOrName) {
    const classNameMappingMetadata = Reflect.getMetadata(CLASS_NAME_MAPPING, Base.constructor) || {};
    if (typeof constructorOrName === "string") {
        return (constructor) => {
            const _class = class extends constructor {
                static tag = constructorOrName;
                constructor(...args) {
                    super();
                    this.init(args[0], args[1]);
                }
            };
            classNameMappingMetadata[constructorOrName] = _class;
            Reflect.defineMetadata(CLASS_NAME_MAPPING, classNameMappingMetadata, Base.constructor);
            Reflect.defineMetadata(CLASS_NAME, constructorOrName, constructor);
            return _class;
        };
    }
    else {
        const _class = class extends constructorOrName {
            static tag = constructorOrName
                .name;
            constructor(...args) {
                super();
                this.init(args[0], args[1]);
            }
        };
        classNameMappingMetadata[constructorOrName.name] = _class;
        Reflect.defineMetadata(CLASS_NAME_MAPPING, classNameMappingMetadata, Base.constructor);
        Reflect.defineMetadata(CLASS_NAME, constructorOrName.name, constructorOrName);
        return _class;
    }
}
exports.Model = Model;
function Primed(factory, propertyOptions = {}) {
    return (instance, propertyKey) => {
        const options = Object.assign(new PropertyOptions(), propertyOptions);
        const metadata = Reflect.getMetadata(PRIMED_PROPERTIES_META, instance) || {};
        metadata[propertyKey] = { factory, options };
        Reflect.defineMetadata(PRIMED_PROPERTIES_META, metadata, instance);
    };
}
exports.Primed = Primed;
class Base {
    constructor(payload) { }
    static tag;
    init(payload = {}, trace = new Set()) {
        this.makeEnumerableGetters(this);
        const primedProperties = Reflect.getMetadata(PRIMED_PROPERTIES_META, this) || {};
        const updatedTrace = new Set(trace).add(trace.size ? this.constructor : "STUB");
        const notPrimed = Object.keys(payload).reduce((acc, key) => (key in primedProperties ? acc : [...acc, key]), []);
        for (const key of notPrimed) {
            const desc = Object.getOwnPropertyDescriptor(this, key);
            if (this.hasOwnProperty(key) &&
                (!desc || desc.writable === true || typeof desc.set === "function")) {
                this[key] = payload[key];
            }
        }
        for (const key in primedProperties) {
            let { factory, options } = primedProperties[key];
            const classNameMappingMetadata = Reflect.getMetadata(CLASS_NAME_MAPPING, Base.constructor);
            const factoryIsString = typeof factory === "string";
            const factoryExtendsBase = !factoryIsString && factory.prototype instanceof Base;
            if (factoryIsString || factoryExtendsBase) {
                const factoryName = factoryIsString
                    ? factory
                    : Reflect.getMetadata(CLASS_NAME, factory);
                factory = classNameMappingMetadata[factoryName];
                if (!factory) {
                    throw Error(`Class ${factoryName} was never added`);
                }
            }
            const value = payload[key];
            if (options.array && payload && payload[key] && !Array.isArray(value)) {
                throw Error(`Array expected for field ${key}`);
            }
            else if (!options.array && value && Array.isArray(value)) {
                throw Error(`Array not expected for field ${key}`);
            }
            if (value !== undefined && value !== null) {
                const values = Array.isArray(value) ? value : [value];
                let instances = [];
                if (factory.prototype instanceof Base) {
                    instances = values.map((val) => Reflect.construct(factory, [val, updatedTrace]));
                }
                else {
                    const getArgs = (value) => (value !== undefined ? [value] : []);
                    instances = values.map((val) => factory(...getArgs(val)));
                }
                this[key] = options.array ? instances : instances.pop();
            }
            else if (options.required) {
                let instance;
                if (factory.prototype instanceof Base) {
                    const isCyclic = updatedTrace.has(factory);
                    if (isCyclic) {
                        this[key] = undefined;
                        continue;
                    }
                    instance = Reflect.construct(factory, [
                        undefined,
                        updatedTrace,
                    ]);
                }
                else {
                    instance = factory();
                }
                this[key] = options.array ? [instance] : instance;
            }
            else if (options.array) {
                this[key] = [];
            }
            else {
                this[key] = null;
            }
        }
        return this;
    }
    makeEnumerableGetters(instance) {
        for (let o = instance; o != Object.prototype; o = Object.getPrototypeOf(o)) {
            for (let name of Object.getOwnPropertyNames(o)) {
                const desc = Object.getOwnPropertyDescriptor(o, name) || {};
                const hasGetter = typeof desc.get === "function";
                if (hasGetter) {
                    desc.enumerable = true;
                    Object.defineProperty(instance, name, desc);
                }
            }
        }
    }
    clone() {
        return Reflect.construct(this.constructor, [this]);
    }
}
exports.Base = Base;
