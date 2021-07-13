import "reflect-metadata";
export declare type Constructor<T = any> = {
    new (...args: any[]): T;
};
export declare type Factory = Function | Constructor | string;
export declare type Indexable = {
    [key: string]: any;
};
export declare type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]>;
};
export declare type BaseConstructorPayload<T, U = undefined> = DeepPartial<U extends undefined ? T : T | U>;
export interface PropertiesMeta {
    [key: string]: {
        factory: Factory;
        options: PropertyOptions;
    };
}
export interface ClassNameMapping {
    [key: string]: Constructor;
}
export declare class PropertyOptions {
    required?: boolean;
    array?: boolean;
}
export declare function Model(constructor: Constructor): void;
export declare function Model(name: string): (constructor: Constructor) => void;
export declare function Primed(factory: Factory, propertyOptions?: PropertyOptions): (instance: any, propertyKey: string | symbol) => void;
export declare class Base<T, U = undefined> {
    constructor(payload?: BaseConstructorPayload<T, U>);
    private init;
    private makeEnumerableGetters;
    clone(): T;
}
