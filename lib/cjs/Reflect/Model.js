"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
require("reflect-metadata");
const Base_1 = require("./Base");
const Symbols_1 = require("./Symbols");
function Model(constructorOrName) {
    const classNameMappingMetadata = Reflect.getMetadata(Symbols_1.CLASS_NAME_MAPPING, Base_1.Base.constructor) || {};
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
            Reflect.defineMetadata(Symbols_1.CLASS_NAME_MAPPING, classNameMappingMetadata, Base_1.Base.constructor);
            Reflect.defineMetadata(Symbols_1.CLASS_NAME, constructorOrName, constructor);
            return _class;
        };
    }
    const _class = class extends constructorOrName {
        static tag = constructorOrName
            .name;
        constructor(...args) {
            super();
            this.init(args[0], args[1]);
        }
    };
    classNameMappingMetadata[constructorOrName.name] = _class;
    Reflect.defineMetadata(Symbols_1.CLASS_NAME_MAPPING, classNameMappingMetadata, Base_1.Base.constructor);
    Reflect.defineMetadata(Symbols_1.CLASS_NAME, constructorOrName.name, constructorOrName);
    return _class;
}
exports.Model = Model;
